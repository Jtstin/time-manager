const { Crypto } = require("@peculiar/webcrypto");
const jwt = require("jsonwebtoken");

const crypto = new Crypto();
const ROUTEKEY_POST_LOGIN = "POST /login";
const DefaultUserId = 1; // there is only one user
function generateToken() {
  // generates token using symmetric key
  return jwt.sign({ userId: DefaultUserId }, process.env.ACCESSTOKEN_KEY, {
    expiresIn: "1d", // token expires in one day
  });
}

async function decrypt(loginRequest) {
  // decrypts the password using an asymmetric private key
  const privateKeyPem = process.env.PRIVATE_KEY;
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    Buffer.from(privateKeyPem, "base64"),
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-1" },
    },
    false,
    ["decrypt"]
  );

  const encryptedPassword = Buffer.from(loginRequest.password, "base64"); // get bytes from base64 encrypted password
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedPassword
  );
  const password = Buffer.from(decryptedBuffer).toString("utf-8");
  return password;
}

exports.lambdaHandler = async (event, context) => {
  const webClientOrigin = process.env.WEB_CLIENT_ORIGIN; //Pulls the web client origin from the environment variable, it removes all single quotation marks
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
      case ROUTEKEY_POST_LOGIN: {
        // verify password and exchange it for token to access api
        const loginRequest = JSON.parse(event.body);
        const password = await decrypt(loginRequest);
        if (password !== process.env.PASSWORD) {
          // if the password is incorrect then return 401(unauthorised)
          return { headers, statusCode: 401 };
        }
        const accessToken = generateToken();
        return {
          headers,
          body: JSON.stringify({ accessToken }),
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
