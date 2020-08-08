//Name: Justin Tan
//Start Date: 18/07/2020
//Last Updated: 08/08/2020
//Description: This is the api for events

const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const ROUTEKEY_GET_EVENTS = "GET /events/{eventDate}";
const ROUTEKEY_PUT_EVENTS = "PUT /events/{eventDate}/{eventId}";
const ROUTEKEY_DELETE_EVENTS = "DELETE /events/{eventDate}/{eventId}";
const Hour = 1000 * 60 * 60;
const DefaultUserId = 1;
function createDocClient() {
  //creating client to access the database
  const endpoint = process.env.DYNAMODB_ENDPOINT;
  if (endpoint === "notset") {
    return new AWS.DynamoDB.DocumentClient();
  }
  return new AWS.DynamoDB.DocumentClient({
    // supports local development
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

  return tokenIsValid(token); // verifies token using function above
}

exports.lambdaHandler = async (event, context) => {
  // handles all http requests for events
  const tokenHeader = event.headers.Authorization;
  if (!verifyToken(tokenHeader)) {
    // verify token and returns unauthorised if token is not valid
    return {
      headers,
      statusCode: 401,
    };
  }
  const webClientOrigin = process.env.WEB_CLIENT_ORIGIN; // Pulls the web client origin from the environment variable, it removes all single quotation marks
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
      case ROUTEKEY_GET_EVENTS: {
        // get events from dynamodb
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
          // returns events as success http response
          headers,
          statusCode: 200,
          body: JSON.stringify({ events: reponse.Items }),
        };
      }
      case ROUTEKEY_PUT_EVENTS: {
        // save events in dynamoDB
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
          // return success http response
          headers,
          statusCode: 200,
        };
      }
      case ROUTEKEY_DELETE_EVENTS: {
        // delete events from dynamoDB
        const eventId = event.pathParameters.eventId;
        const docClient = createDocClient();
        await docClient
          .delete({ TableName: "events", Key: { id: Number(eventId) } })
          .promise();
        return {
          //return success http response
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
    return err;
  }
};
