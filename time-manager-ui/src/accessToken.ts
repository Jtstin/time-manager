const OneDay = 1000 * 60 * 60 * 24;
const AccessToken = "access_token";
export function saveAccessToken(token: string) {
  window.sessionStorage.setItem(AccessToken, token);
  setInterval(() => {
    window.sessionStorage.removeItem(AccessToken);
  }, OneDay);
}

export function redirectToLoginWhenTokenNotFound(history) {
  const accessToken = window.sessionStorage.getItem(AccessToken);
  if (!accessToken) {
    history.push("/login");
  }
}

export function getHeaderWithBearerToken() {
  const accessToken = window.sessionStorage.getItem(AccessToken);
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

const publicKey = {
  alg: "RSA-OAEP",
  e: "AQAB",
  ext: true,
  key_ops: ["encrypt"],
  kty: "RSA",
  n:
    "ox8gaw5RHFGaygRIh3a-gqtqi9d4N0knJNfE03q8Cu5NfgtgOtaMOIY9WYFBNy7GRn_YCyyNNHIow-ccczUhn_SmziP3c970dl4faak4X-OUQYvkfVnATI7q_2czEOZVxHQx8R0sWhJpW81fampy73dsGOhDHaNiUfDuht6DdWxrNtL4yJiFXIs54OL2JbbqDjEr_5IeEkzcdS3GnYdbe4gQfe7aD-CmErrr_LN1KteLdJMKw2sa1SnRYJ9M0PfdvmE-Qw71ZfnqDkam0eCSXZ4ddDqkbarxDzPLV76b3NKNoAH-iPsMDP364SxP3LCSE796nd6E4DMO1KCINJoAFw",
};

export function encrypt(password: string) {
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

export function str2ab(str) {
  let enc = new TextEncoder();
  return enc.encode(str);
}
