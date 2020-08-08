//Name: Justin Tan
//Start Date: 31/07/2020
//Last Updated: 08/08/2020
//Description: This is where the access token is saved and allows user to access api

const OneDay = 1000 * 60 * 60 * 24;
const AccessToken = "access_token";
export function saveAccessToken(token: string) {
  // saves token for subsequent uses when calling api
  window.sessionStorage.setItem(AccessToken, token);
  setInterval(() => {
    // removes token as it expires after one day
    window.sessionStorage.removeItem(AccessToken);
  }, OneDay);
}

export function redirectToLoginWhenTokenNotFound(history) {
  // redirects user to login screen when token is not found
  const accessToken = window.sessionStorage.getItem(AccessToken);
  if (!accessToken) {
    history.push("/login");
    return true;
  }
  return false;
}

export function getHeaderWithBearerToken() {
  // include token in api request
  const accessToken = window.sessionStorage.getItem(AccessToken);
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

function str2ab(str) {
  // encodes password to utf-8 bytes for encryption
  let enc = new TextEncoder();
  return enc.encode(str);
}

const localPublicKey = {
  // generated public key in browser for local development
  alg: "RSA-OAEP",
  e: "AQAB",
  ext: true,
  key_ops: ["encrypt"],
  kty: "RSA",
  n:
    "ox8gaw5RHFGaygRIh3a-gqtqi9d4N0knJNfE03q8Cu5NfgtgOtaMOIY9WYFBNy7GRn_YCyyNNHIow-ccczUhn_SmziP3c970dl4faak4X-OUQYvkfVnATI7q_2czEOZVxHQx8R0sWhJpW81fampy73dsGOhDHaNiUfDuht6DdWxrNtL4yJiFXIs54OL2JbbqDjEr_5IeEkzcdS3GnYdbe4gQfe7aD-CmErrr_LN1KteLdJMKw2sa1SnRYJ9M0PfdvmE-Qw71ZfnqDkam0eCSXZ4ddDqkbarxDzPLV76b3NKNoAH-iPsMDP364SxP3LCSE796nd6E4DMO1KCINJoAFw",
};
const webPublicKey = {
  // generated public key in browser for web
  alg: "RSA-OAEP",
  e: "AQAB",
  ext: true,
  key_ops: ["encrypt"],
  kty: "RSA",
  n:
    "nJJCkH3S8g2fh2Z5zO5KhiddHiJCDYDiVnWhSXjuE4zjLyUasX9OoS4PJqWxLTThF_8a3imBOiBwJmnBy6oysnuU2M0pxHoSzf38XpuJgKUC1QD3Qetuae4pWDftBn1L3TvpGSHQDPpJwNrT6gYJDUKmu49AFOa6opKNVSF4QD0BGijN3vZnb_ZHtt46sRnMMb8XwtYESXHYPPhDUF0SJrtBiWrulAWDoEL0pXNtIAG1O2fx0D4j17cca9hPjugZKtwgojJiIK8Xz_LGdJXX_1gaw0NdFS7GJtPwHfU-4ngWh_UFqC8UEBnq1rKo53tiUH-poUi9-Qro0MPVHldS_Q",
};
export function encrypt(password: string) {
  // uses the right public key supporting local development
  let publicKey = webPublicKey;
  if (window.location.href.indexOf("localhost") >= 0) {
    publicKey = localPublicKey;
  }
  // encrypts password
  return crypto.subtle
    .importKey(
      "jwk",
      publicKey,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-1" },
      },
      false,
      ["encrypt"]
    )
    .then((key) =>
      crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        key,
        str2ab(password)
      )
    )
    .then((cipher) =>
      window.btoa(String.fromCharCode(...new Uint8Array(cipher)))
    );
}
