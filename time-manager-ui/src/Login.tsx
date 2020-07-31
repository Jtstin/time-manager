import React, { useState } from "react";
import { render } from "react-dom";
import { saveAccessToken } from "./accessToken";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const handleSaveToken = () => {
    saveAccessToken("test");
    history.go(-1);
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
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={handleSaveToken}>Login</button>
      </div>
    </div>
  );
};

export default Login;
