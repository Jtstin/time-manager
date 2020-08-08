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
  // assigining number to day of the week
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

function getDateRange() {
  // get last 7 days start and end date
  const now = Date.now();
  const nowDate = new Date(now);
  const todayNumber = nowDate.setHours(0, 0, 0, 0);
  const start = todayNumber - 6 * OneDay;
  return { start, end: now, startOfToday: todayNumber };
}

function getPast7DaysInclusiveOfToday(today) {
  // get days of week text into an array in forward order
  const days = [];
  let dayOfTheWeek = today;
  let dayCount = 0;
  while (dayCount < 7) {
    // start on today's date and adds the last 6 days backwards
    days.push(DayNumberToDayText[dayOfTheWeek]);
    if (dayOfTheWeek === 0) {
      dayOfTheWeek = 6; // reset to Saturday when it reaches Sunday
    } else {
      dayOfTheWeek--;
    }
    dayCount++;
  }
  return days.reverse();
}

function getDayCount(completedTasks) {
  //  counts the amount of completed tasks on that day
  const daysOfCompletedTasks = completedTasks.map(
    (completedTask) =>
      DayNumberToDayText[new Date(completedTask.completed).getDay()]
  );
  const dayCount = {
    // completed task count for each of the days
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };
  for (let index = 0; index < daysOfCompletedTasks.length; index++) {
    // adds to the count for the day the task was completed
    const dayText = daysOfCompletedTasks[index];
    dayCount[dayText]++;
  }
  return dayCount;
}

function getSummary(completedTasks, todayNumber) {
  // gets summary of completed tasks
  const today = new Date(todayNumber).getDay();
  const dayCount = getDayCount(completedTasks);

  const result = [];
  const days = getPast7DaysInclusiveOfToday(today);
  for (let i = 0; i < days.length; i++) {
    // add day and count of completed task to array
    result.push([days[i], dayCount[days[i]]]);
  }
  return result;
}

function createDocClient() {
  //creating client to access the database
  const endpoint = process.env.DYNAMODB_ENDPOINT;
  if (endpoint === "notset") {
    return new AWS.DynamoDB.DocumentClient();
  }
  // supports local development
  return new AWS.DynamoDB.DocumentClient({
    endpoint,
  });
}

function tokenIsValid(token) {
  // verifies the token
  try {
    const decoded = jwt.verify(token, process.env.ACCESSTOKEN_KEY);
    return decoded.userId === DefaultUserId;
  } catch {
    return false;
  }
}

function verifyToken(tokenHeader) {
  // checks if there is a token in the http header
  if (tokenHeader === undefined || tokenHeader === null) {
    return false;
  }

  if (tokenHeader.indexOf("Bearer") !== 0) {
    return false;
  }
  // extracts token from header
  const token = tokenHeader.split(" ")[1];

  return tokenIsValid(token);
}

exports.lambdaHandler = async (event, context) => {
  // handles all http requests for tasks
  const tokenHeader = event.headers.Authorization;
  if (!verifyToken(tokenHeader)) {
    // verify token and returns unauthorised if token is not valid
    return {
      headers,
      statusCode: 401,
    };
  }
  const webClientOrigin = process.env.WEB_CLIENT_ORIGIN;
  const headers = {
    // CORs (cross origin resource sharing ) and format headers
    "Access-Control-Allow-Origin": webClientOrigin,
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  };
  const routeKey = `${event.httpMethod} ${event.resource}`; //form a string from method and path
  try {
    switch (routeKey) {
      case ROUTEKEY_GET_TASKS: {
        // get tasks from dynamodb
        const docClient = createDocClient();
        const response = await docClient.scan({ TableName: "tasks" }).promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: response.Items }),
        };
      }
      case ROUTEKEY_GET_HIGH_PRIORITY_TASKS: {
        // get high priority tasks from dynamodb
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
        // delete tasks from dynamodb
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
        // get remaining tasks from dynamodb
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
              ":v_completed": 0, // remaining tasks do not have a completed time stamp
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
        // get completed tasks summary from dynamodb
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
        // return an empty array if there is no data so that get summary doesn't fail
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
        // save tasks to dynamodb
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
          // when there is no method and path combination found return 404(not found)
          headers,
          statusCode: 404,
        };
    }
  } catch (err) {
    // catch and log any error
    console.log(err);
    return {
      headers,
      statusCode: 500,
    };
  }
};
