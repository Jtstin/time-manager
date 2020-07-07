import React from "react";
import { render } from "react-dom";

const Login = () => {
  return (
    <div className="login-page">
      <div className="message">WELCOME BACK</div>
      <div className="password">
        <label htmlFor="pw">password:</label>
        <input type="password" id="pw" name="pw"></input>
        <button>Login</button>
      </div>
    </div>
  );
};

export default Login;
