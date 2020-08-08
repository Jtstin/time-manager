import React, { useState } from "react";
import { render } from "react-dom";
import { saveAccessToken, str2ab, publicKey, encrypt } from "./accessToken";
import { useHistory } from "react-router-dom";
import { api } from "./api";

export default function Login() {
  // useState allows components to have states
  const [password, setPassword] = useState("");
  const [loginErrMsg, setLoginErrMsg] = useState("");
  const [loginFailures, setLoginFailures] = useState(0);
  const history = useHistory();

  const handleSaveToken = () => {
    // checks if the user has exceeded the amount of tries
    if (loginFailures > 3) {
      setLoginErrMsg("Exceeded password tries");
      return;
    }
    // it encrypts the password and checks if it is correct
    encrypt(password)
      .then((encryptedPassword) => api.login(encryptedPassword))
      .then((token) => {
        if (token === null) {
          setLoginErrMsg("Incorrect Password");
          setLoginFailures(loginFailures + 1);
          return;
        }
        // gets token to access api and tasks screen(default)
        saveAccessToken(token);
        history.go(-1);
      });
  };
  return (
    // layout component
    // bind handlers to events and states to display
    <div className="login-page">
      <div className="message">WELCOME BACK</div>
      <div className="password">
        <div>
          <input
            placeholder="enter password"
            type="password"
            id="pw"
            name="pw"
            onChange={(e) => {
              // remove error message when user changes input
              setPassword(e.target.value);
              setLoginErrMsg("");
            }}
          ></input>
          <button onClick={handleSaveToken}>Login</button>

          <div className="error-message">{loginErrMsg}</div>
        </div>
      </div>
    </div>
  );
}
