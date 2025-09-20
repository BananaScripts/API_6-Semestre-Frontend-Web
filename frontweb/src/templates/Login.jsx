import React from "react";
import "../static/login.css";
import Background1 from "../assets/background2.jpg";

function Login() {
  return (
    <div
      id="login-container"
      style={{ backgroundImage: `url(${Background1})` }}
    >
      <div className="login-panel">
        <form id="login-form">
          <h1>Bem-vindo à Dom Rock</h1>

          <label htmlFor="username">Usuário</label>
          <input type="text" id="username" name="username" required />

          <label htmlFor="password">Senha</label>
          <input type="password" id="password" name="password" required />

          <button type="submit">Entrar</button>

          <a href="#">Esqueceu sua senha?</a>
        </form>
      </div>
    </div>
  );
}

export default Login;
