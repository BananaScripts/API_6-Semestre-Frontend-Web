import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../static/login.css";
import fwAuth from "../utils/frontendAuth";
import akasysLogo from "../assets/akasysver.png";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If enabled, use the frontend-only auth helper for local/dev testing
    const useFrontendAuth = process.env.REACT_APP_FRONTEND_AUTH === "true";
    if (useFrontendAuth) {
      const res = fwAuth.loginUser({ email, senha });
      if (!res.ok) return alert(res.detail || "Falha no login");
      localStorage.setItem("token", res.access_token);
      navigate("/home");
      return;
    }

    try {
      const authRoute = process.env.REACT_APP_LOGIN_ROUTE || "/login";
      const useForm = process.env.REACT_APP_USE_FORM === "true";

      let response;
      if (useForm) {
        response = await fetch(authRoute, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ username: email, password: senha }),
        });
      } else {
        response = await fetch(authRoute, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, senha: senha }),
        });
      }

      if (response.status === 404) {
        throw new Error(
          `Rota não encontrada: ${authRoute}. Verifique se o backend está executando e se a rota existe (veja reminders/ROUTES.md).`
        );
      }

      if (!response.ok) throw new Error("Email ou senha inválidos");

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div id="login-container">
      <div className="decor-left" />
      <div className="decor-right" />
      <div className="login-panel card">
        <form id="login-form" onSubmit={handleSubmit}>
          <img src={akasysLogo} alt="Logo Akasys" />
          <h1 className="text-title">Bem-vindo à Akasys</h1>

          <label htmlFor="email">Email</label>
          <div className="input-container">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="senha">Senha</label>
          <div className="input-container">
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <button className="button-primary" type="submit">
              Entrar
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link to="/register" className="text-link">
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
