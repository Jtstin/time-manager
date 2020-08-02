const { Crypto } = require("@peculiar/webcrypto");
const jwt = require("jsonwebtoken");

const crypto = new Crypto();
const ROUTEKEY_POST_LOGIN = "POST /login";
const DefaultUserId = 1;
function generateToken() {
  return jwt.sign({ userId: DefaultUserId }, process.env.ACCESSTOKEN_KEY, {
    expiresIn: "1d",
  });
}

async function decrypt(loginRequest) {
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

  const encryptedPassword = Buffer.from(loginRequest.password, "base64");
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
        const password = await decrypt(loginRequest);
        if (password !== "secret") {
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
          headers,
          statusCode: 404,
        };
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
