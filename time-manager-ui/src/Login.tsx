import React, { useState } from "react";
import { render } from "react-dom";
import { saveAccessToken, str2ab, publicKey, encrypt } from "./accessToken";
import { useHistory } from "react-router-dom";
import { api } from "./api";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loginErrMsg, setLoginErrMsg] = useState("");
  const [loginFailures, setLoginFailures] = useState(0);
  const history = useHistory();

  const handleSaveToken = () => {
    if (loginFailures > 3) {
      setLoginErrMsg("Exceeded password tries");
      return;
    }
    encrypt(password)
      .then((encryptedPassword) => api.login(encryptedPassword))
      .then((token) => {
        if (token === null) {
          setLoginErrMsg("Incorrect Password");
          setLoginFailures(loginFailures + 1);
          return;
        }
        saveAccessToken(token);
        history.go(-1);
      });
  };
  return (
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
