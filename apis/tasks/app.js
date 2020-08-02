const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const ROUTEKEY_GET_TASKS = "GET /tasks";
const ROUTEKEY_GET_REMAINING_TASKS = "GET /remaining-tasks";
const ROUTEKEY_GET_HIGH_PRIORITY_TASKS = "GET /high-priority-tasks";
const ROUTEKEY_PUT_TASKS = "PUT /tasks/{taskId}";
const ROUTEKEY_GET_COMPLETED_TASKS_SUMMARY = "GET /completed-tasks-summary";
const ROUTEKEY_DELETE_TASK = "DELETE /tasks/{taskId}";

const OneDay = 1000 * 60 * 60 * 24;
const DefaultUserId = 1;
const DayNumberToDayText = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function getDateRange() {
  const now = Date.now();
  const nowDate = new Date(now);
  const todayNumber = nowDate.setHours(0, 0, 0, 0);
  const start = todayNumber - 6 * OneDay;
  return { start, end: now, startOfToday: todayNumber };
}

function getPast7DaysInclusiveOfToday(today) {
  const days = [];
  let dayOfTheWeek = today;
  let dayCount = 0;
  while (dayCount < 7) {
    days.push(DayNumberToDayText[dayOfTheWeek]);
    if (dayOfTheWeek === 0) {
      dayOfTheWeek = 6;
    } else {
      dayOfTheWeek--;
    }
    dayCount++;
  }
  return days.reverse();
}

function getDayCount(completedTasks) {
  const daysOfCompletedTasks = completedTasks.map(
    (completedTask) =>
      DayNumberToDayText[new Date(completedTask.completed).getDay()]
  );
  const dayCount = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };
  for (let index = 0; index < daysOfCompletedTasks.length; index++) {
    const dayText = daysOfCompletedTasks[index];
    dayCount[dayText]++;
  }
  return dayCount;
}

function getSummary(completedTasks, todayNumber) {
  const today = new Date(todayNumber).getDay();
  const dayCount = getDayCount(completedTasks);

  const result = [];
  const days = getPast7DaysInclusiveOfToday(today);
  for (let i = 0; i < days.length; i++) {
    result.push([days[i], dayCount[days[i]]]);
  }
  return result;
}

function createDocClient() {
  const endpoint = process.env.DYNAMODB_ENDPOINT;
  if (endpoint === "notset") {
    return new AWS.DynamoDB.DocumentClient();
  }
  return new AWS.DynamoDB.DocumentClient({
    endpoint,
  });
}

function tokenIsValid(token) {
  try {
    const decoded = jwt.verify(token, process.env.ACCESSTOKEN_KEY);
    return decoded.userId === DefaultUserId;
  } catch {
    return false;
  }
}

function verifyToken(tokenHeader) {
  if (tokenHeader === undefined || tokenHeader === null) {
    return false;
  }

  if (tokenHeader.indexOf("Bearer") !== 0) {
    return false;
  }
  const token = tokenHeader.split(" ")[1];

  return tokenIsValid(token);
}

exports.lambdaHandler = async (event, context) => {
  const tokenHeader = event.headers.Authorization;
  if (!verifyToken(tokenHeader)) {
    return {
      headers,
      statusCode: 401,
    };
  }
  const webClientOrigin = process.env.WEB_CLIENT_ORIGIN;
  const headers = {
    "Access-Control-Allow-Origin": webClientOrigin,
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  };
  const routeKey = `${event.httpMethod} ${event.resource}`;
  try {
    switch (routeKey) {
      case ROUTEKEY_GET_TASKS: {
        const docClient = createDocClient();
        const response = await docClient.scan({ TableName: "tasks" }).promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: response.Items }),
        };
      }
      case ROUTEKEY_GET_HIGH_PRIORITY_TASKS: {
        const docClient = createDocClient();
        const response = await docClient
          .query({
            IndexName: "ix-priority",
            TableName: "tasks",
            KeyConditionExpression:
              "#userId = :v_userId and #priority = :v_priority",
            ExpressionAttributeNames: {
              "#userId": "userId",
              "#priority": "priority",
            },
            ExpressionAttributeValues: {
              ":v_userId": DefaultUserId,
              ":v_priority": "High",
            },
          })
          .promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: response.Items }),
        };
      }
      case ROUTEKEY_DELETE_TASK: {
        const taskId = event.pathParameters.taskId;
        const docClient = createDocClient();
        await docClient
          .delete({ TableName: "tasks", Key: { id: Number(taskId) } })
          .promise();
        return {
          headers,
          statusCode: 200,
        };
      }
      case ROUTEKEY_GET_REMAINING_TASKS: {
        const docClient = createDocClient();
        const response = await docClient
          .query({
            IndexName: "ix-completed",
            TableName: "tasks",
            KeyConditionExpression:
              "#userId = :v_userId and #completed = :v_completed",
            ExpressionAttributeNames: {
              "#userId": "userId",
              "#completed": "completed",
            },
            ExpressionAttributeValues: {
              ":v_userId": DefaultUserId,
              ":v_completed": 0,
            },
          })
          .promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: response.Items }),
        };
      }
      case ROUTEKEY_GET_COMPLETED_TASKS_SUMMARY: {
        const docClient = createDocClient();
        const { start, end, startOfToday } = getDateRange();
        const response = await docClient
          .query({
            IndexName: "ix-completed",
            TableName: "tasks",
            KeyConditionExpression:
              "#userId = :v_userId and #completed BETWEEN :v_completed_start AND :v_completed_end",
            ExpressionAttributeNames: {
              "#userId": "userId",
              "#completed": "completed",
            },
            ExpressionAttributeValues: {
              ":v_userId": DefaultUserId,
              ":v_completed_start": start,
              ":v_completed_end": end,
            },
          })
          .promise();
        let completedTasks = [];
        if (response && response.Items) {
          completedTasks = response.Items;
        }
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({
            summary: getSummary(completedTasks, startOfToday),
          }),
        };
      }
      case ROUTEKEY_PUT_TASKS: {
        const taskId = event.pathParameters.taskId;
        const task = JSON.parse(event.body);
        const docClient = createDocClient();
        await docClient
          .put({
            TableName: "tasks",
            Item: { userId: DefaultUserId, id: taskId, ...task },
          })
          .promise();
        return {
          headers,
          statusCode: 200,
        };
      }
      default:
        return {
          headers,
          statusCode: 404,
        };
    }
  } catch (err) {
    console.log(err);
    return {
      headers,
      statusCode: 500,
    };
  }
};
