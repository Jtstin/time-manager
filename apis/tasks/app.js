const AWS = require("aws-sdk");
const ROUTEKEY_GET_TASKS = "GET /tasks";
const ROUTEKEY_PUT_TASKS = "PUT /tasks/{taskId}";

exports.lambdaHandler = async (event, context) => {
  const webClientOrigin = process.env.WEB_CLIENT_ORIGIN.replace(/'/g, ""); //Pulls the web client origin from the environment variable, it removes all single quotation marks
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
        const docClient = new AWS.DynamoDB.DocumentClient({
          endpoint: "http://host.docker.internal:8000",
        });
        const reponse = await docClient.scan({ TableName: "tasks" }).promise();

        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ tasks: reponse.Items }),
        };
      }
      case ROUTEKEY_PUT_TASKS: {
        const taskId = event.pathParameters.taskId;
        const task = JSON.parse(event.body);
        const docClient = new AWS.DynamoDB.DocumentClient({
          endpoint: "http://host.docker.internal:8000",
        });
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
    return err;
  }
};
