// frontend/src/components/CampoFlotante.jsx
import React, { useState } from "react";
import {
  FaExclamationCircle,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const CampoFlotante = ({
  icon,
  tipo,
  value,
  onChange,
  label,
  placeholder,
  obligatorio,
  error,
  tema,
  estilos,
  validacion,
  marginBottom,
}) => {
  const [activo, setActivo] = useState(false);
  const lleno = value.length > 0;

  return (
    <div
      style={{
        position: "relative",
        marginBottom: marginBottom !== undefined ? marginBottom : 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "1rem",
          top: "1rem",
          fontSize: "1.2rem",
          color: error
            ? tema.error
            : validacion?.tipo === "valido"
              ? tema.exito
              : activo
                ? tema.primario
                : tema.texto + "40",
          transition: "all 0.3s",
        }}
      >
        {icon}
      </span>
      <label
        style={{
          position: "absolute",
          left: lleno || activo ? "0.5rem" : "3rem",
          top: lleno || activo ? "-0.6rem" : "1rem",
          fontSize: lleno || activo ? "0.75rem" : "0.95rem",
          fontWeight: "500",
          color: error
            ? tema.error
            : activo
              ? tema.primario
              : tema.texto + "60",
          transition: "all 0.3s ease",
          pointerEvents: "none",
          backgroundColor: lleno || activo ? tema.fondoAlt : "transparent",
          padding: "0 0.25rem",
          borderRadius: "4px",
          zIndex: 2,
        }}
      >
        {label}
        {obligatorio && <span style={{ color: tema.error }}>*</span>}
      </label>
      <input
        type={tipo === "date" ? (activo ? "date" : "text") : tipo}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActivo(true)}
        onBlur={(e) => {
          if (tipo === "date" && !e.target.value) {
            // Forzar volver a text si está vacío al perder foco
            e.target.type = "text";
          }
          setActivo(false);
        }}
        placeholder={activo ? (tipo === "date" ? "" : placeholder) : ""}
        style={{
          width: "100%",
          padding: "1rem 1rem 1rem 3rem",
          border: `2px solid ${error ? tema.error : validacion?.tipo === "valido" ? tema.exito : activo ? tema.primario : tema.texto + "20"}`,
          borderRadius: "14px",
          fontSize: "0.95rem",
          background: tema.fondoAlt,
          color: tema.texto,
          transition: "all 0.3s",
          boxShadow: activo ? `0 0 0 4px ${tema.primario}15` : "none",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: tipo === "date" && !activo ? "inherit" : "inherit",
        }}
      />
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginTop: "0.4rem",
            marginLeft: "0.5rem",
            fontSize: "0.8rem",
            color: tema.error,
          }}
        >
          <FaExclamationCircle />
          {error}
        </div>
      )}
      {validacion && !error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginTop: "0.4rem",
            marginLeft: "0.5rem",
            fontSize: "0.8rem",
            color: validacion.color,
          }}
        >
          {validacion.tipo === "checking" ? (
            <FaSpinner />
          ) : validacion.tipo === "valido" ? (
            <FaCheck />
          ) : (
            <FaTimes />
          )}
          {validacion.texto}
        </div>
      )}
    </div>
  );
};

export default CampoFlotante;
