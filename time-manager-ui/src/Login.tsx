import React, { useState } from "react";
import { render } from "react-dom";
import { saveAccessToken, str2ab, publicKey, encrypt } from "./accessToken";
import { useHistory } from "react-router-dom";
import { api } from "./api";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loginErrMsg, setLoginErrMsg] = useState("");
  const history = useHistory();

  const handleSaveToken = () => {
    encrypt(password)
      .then((encryptedPassword) => api.login(encryptedPassword))
      .then((token) => {
        if (token === null) {
          setLoginErrMsg("Incorrect Password");
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
        <label htmlFor="pw">password:</label>
        <input
          type="password"
          id="pw"
          name="pw"
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginErrMsg("");
          }}
        ></input>
        <div>{loginErrMsg}</div>
        <button onClick={handleSaveToken}>Login</button>
      </div>
    </div>
  );
}
