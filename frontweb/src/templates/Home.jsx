import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    setNome(payload.nome);


  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bem-vindo, {nome}!</h1>
      <p>Você está logado com sucesso na Dom Rock.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Home;
