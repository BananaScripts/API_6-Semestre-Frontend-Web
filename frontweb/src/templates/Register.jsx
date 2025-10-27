import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import akasysLogo from "../assets/akasysver.png";
import { Link } from "react-router-dom";

export default function Register(){
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.createUser({ nome, email, senha });
      // If backend returns token set it, otherwise prompt user to login
      if (data && data.access_token) localStorage.setItem('token', data.access_token);
      navigate('/home');
    } catch (err) { alert(err.message || 'Registro falhou'); }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img src={akasysLogo} alt="Logo Akasys" style={{ height: 64 }} />
          <h1 className="text-title">Crie sua conta na Akasys</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label style={{ minWidth: 80 }}>Nome</label>
            <input value={nome} onChange={(e)=>setNome(e.target.value)} required />
          </div>
          <div className="input-container">
            <label style={{ minWidth: 80 }}>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="input-container">
            <label style={{ minWidth: 80 }}>Senha</label>
            <input type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button className="button-primary" type="submit">Criar conta</button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" className="text-link">Já tem conta? Entrar</Link>
        </div>

      </div>
    </div>
  );
}
