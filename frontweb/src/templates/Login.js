import React from "react";
import "../static/login.css";

function Login() {
  return (
    <div id="login-container">
      <h1>Login</h1>
      <form id="login-form">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
