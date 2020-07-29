const AWS = require("aws-sdk");
const ROUTEKEY_GET_EVENTS = "GET /events/{eventDate}";
const ROUTEKEY_PUT_EVENTS = "PUT /events/{eventDate}/{eventId}";
const ROUTEKEY_DELETE_EVENTS = "DELETE /events/{eventDate}/{eventId}";
const Hour = 1000 * 60 * 60;
const DefaultUserId = 1;
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
  const webClientOrigin = process.env.WEB_CLIENT_ORIGIN; //Pulls the web client origin from the environment variable, it removes all single quotation marks
  const headers = {
    "Access-Control-Allow-Origin": webClientOrigin,
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
  };
  const routeKey = `${event.httpMethod} ${event.resource}`;
  try {
    switch (routeKey) {
      case ROUTEKEY_GET_EVENTS: {
        const eventDate = event.pathParameters.eventDate;
        const docClient = createDocClient();

        const reponse = await docClient
          .query({
            IndexName: "ix-event-date",
            TableName: "events",
            KeyConditionExpression:
              "#userId = :v_userId and #eventDate =:v_eventDate",
            ExpressionAttributeNames: {
              "#userId": "userId",
              "#eventDate": "eventDate",
            },
            ExpressionAttributeValues: {
              ":v_userId": DefaultUserId,
              ":v_eventDate": eventDate,
            },
          })
          .promise();

        return {
          headers,
          statusCode: 200,
          body: JSON.stringify({ events: reponse.Items }),
        };
      }
      case ROUTEKEY_PUT_EVENTS: {
        const eventId = event.pathParameters.eventId;
        const eventDate = event.pathParameters.eventDate;
        const tmEvent = JSON.parse(event.body);
        const docClient = createDocClient();
        await docClient
          .put({
            TableName: "events",
            Item: { id: eventId, userId: DefaultUserId, eventDate, ...tmEvent },
          })
          .promise();
        return {
          headers,
          statusCode: 200,
        };
      }
      case ROUTEKEY_DELETE_EVENTS: {
        const eventId = event.pathParameters.eventId;
        const docClient = createDocClient();
        await docClient
          .delete({ TableName: "events", Key: { id: Number(eventId) } })
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
