import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../static/login.css";
import api from "../services/api";
import akasysLogo from "../assets/akasysver.png";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login({ email, senha });
      if (data && data.access_token) {
        navigate('/home');
      } else {
        alert('Falha no login');
      }
    } catch (err) {
      alert(err.message || 'Falha no login');
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
