import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/login.css";
import domrockLogo from "../assets/domrock.png";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: senha,
        }),
      });

      if (!response.ok) throw new Error("Email ou senha inválidos");

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      console.log("Redirecionando...");
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div id="login-container">
      <div className="login-panel">
        <form id="login-form" onSubmit={handleSubmit}>
          <img src={domrockLogo} alt="Logo DomRock" />
          <h1>Bem-vindo à Dom Rock</h1>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
