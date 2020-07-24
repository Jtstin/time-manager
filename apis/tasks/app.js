const AWS = require("aws-sdk");
const ROUTEKEY_GET_TASKS = "GET /tasks";
const ROUTEKEY_GET_REMAINING_TASKS = "GET /remaining-tasks";
const ROUTEKEY_GET_HIGH_PRIORITY_TASKS = "GET /high-priority-tasks";
const ROUTEKEY_PUT_TASKS = "PUT /tasks/{taskId}";

function createDocClient() {
  const endpoint = process.env.DYNAMODB_ENDPOINT;
  if (endpoint === "notset") {
    return new AWS.DynamoDB.DocumentClient();
  }
  return new AWS.DynamoDB.DocumentClient({
    endpoint,
  });
}
exports.lambdaHandler = async (event, context) => {
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
        const reponse = await docClient.scan({ TableName: "tasks" }).promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: reponse.Items }),
        };
      }
      case ROUTEKEY_GET_HIGH_PRIORITY_TASKS: {
        const docClient = createDocClient();
        const reponse = await docClient
          .query({
            IndexName: "ix-priority",
            TableName: "tasks",
            KeyConditionExpression: "#priority = :v_priority",
            ExpressionAttributeNames: {
              "#priority": "priority",
            },
            ExpressionAttributeValues: {
              ":v_priority": "High",
            },
          })
          .promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: reponse.Items }),
        };
      }
      case ROUTEKEY_GET_REMAINING_TASKS: {
        const docClient = createDocClient();
        const reponse = await docClient
          .query({
            IndexName: "ix-completed",
            TableName: "tasks",
            KeyConditionExpression: "#completed = :v_completed",
            ExpressionAttributeNames: {
              "#completed": "completed",
            },
            ExpressionAttributeValues: {
              ":v_completed": 0,
            },
          })
          .promise();
        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: reponse.Items }),
        };
      }
      case ROUTEKEY_PUT_TASKS: {
        const taskId = event.pathParameters.taskId;
        const task = JSON.parse(event.body);
        const docClient = createDocClient();
        await docClient
          .put({ TableName: "tasks", Item: { id: taskId, ...task } })
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
