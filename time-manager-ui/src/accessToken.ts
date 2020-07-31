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
