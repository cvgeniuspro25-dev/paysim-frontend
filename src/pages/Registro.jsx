// frontend/src/pages/Registro.jsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Registro = () => {
  const tema = getTemaActivo();
  const textos = cerebroFront.textos.registro;

  const handleVolver = () => {
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tema.fondo,
        color: tema.texto,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <FaArrowLeft
        onClick={handleVolver}
        style={{
          fontSize: "2rem",
          color: tema.primario,
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      />
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
        {textos.titulo}
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "500px", marginBottom: "2rem" }}>
        {textos.enConstruccion}
      </p>
      <button
        onClick={handleVolver}
        style={{
          padding: "0.8rem 2rem",
          borderRadius: "30px",
          border: "none",
          backgroundColor: tema.primario,
          color: tema.textoInverso,
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {textos.botonVolver}
      </button>
    </div>
  );
};

export default Registro;