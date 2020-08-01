const ROUTEKEY_POST_LOGIN = "POST /login";

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
      case ROUTEKEY_POST_LOGIN: {
        const accessToken = "token";
        const loginRequest = JSON.parse(event.body);
        if (loginRequest.password !== "secret") {
          return { headers, statusCode: 401 };
        }
        return {
          headers,
          body: JSON.stringify({ accessToken }),
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
