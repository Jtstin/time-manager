const AWS = require("aws-sdk");
const ROUTEKEY_GET_EVENTS = "GET /events";
const ROUTEKEY_PUT_EVENTS = "PUT /events/{eventId}";

exports.lambdaHandler = async (event, context) => {
  const routeKey = `${event.httpMethod} ${event.resource}`;
  try {
    switch (routeKey) {
      case ROUTEKEY_GET_EVENTS: {
        const docClient = new AWS.DynamoDB.DocumentClient({
          endpoint: "http://host.docker.internal:8000",
        });
        const reponse = await docClient.scan({ TableName: "events" }).promise();

        return {
          statusCode: 200,
          body: JSON.stringify({ events: reponse.Items }),
        };
      }
      case ROUTEKEY_PUT_EVENTS: {
        const eventId = event.pathParameters.eventId;
        const tmEvent = JSON.parse(event.body);
        const docClient = new AWS.DynamoDB.DocumentClient({
          endpoint: "http://host.docker.internal:8000",
        });
        await docClient
          .put({ TableName: "events", Item: { id: eventId, ...tmEvent } })
          .promise();
        return {
          statusCode: 200,
        };
      }
      default:
        return {
          statusCode: 404,
        };
    }
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
