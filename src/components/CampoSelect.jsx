// frontend/src/components/CampoSelect.jsx
import React, { useState } from "react";
import { FaExclamationCircle, FaChevronDown } from "react-icons/fa";

const CampoSelect = ({
  icon,
  value,
  onChange,
  label,
  placeholder,
  obligatorio,
  error,
  opciones,
  tema,
  marginBottom,
}) => {
  const [activo, setActivo] = useState(false);
  const lleno = value && value.length > 0;

  const selectStyle = {
    width: "100%",
    padding: "1rem 1rem 1rem 3rem",
    border: `2px solid ${error ? tema.error : activo ? tema.primario : tema.texto + "20"}`,
    borderRadius: "14px",
    fontSize: "0.95rem",
    background: tema.fondoAlt,
    color: tema.texto,
    transition: "all 0.3s",
    boxShadow: activo ? `0 0 0 4px ${tema.primario}15` : "none",
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "relative",
        marginBottom: marginBottom !== undefined ? marginBottom : 0,
      }}
    >
      {/* Icono izquierdo */}
      <span
        style={{
          position: "absolute",
          left: "1rem",
          top: "1rem",
          fontSize: "1.2rem",
          color: error
            ? tema.error
            : activo
              ? tema.primario
              : tema.texto + "40",
          transition: "all 0.3s",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {icon}
      </span>

      {/* Etiqueta flotante */}
      <label
        style={{
          position: "absolute",
          left: lleno ? "0.5rem" : "3rem",
          top: lleno ? "-0.6rem" : "1rem",
          fontSize: lleno ? "0.75rem" : "0.95rem",
          fontWeight: "500",
          color: error
            ? tema.error
            : activo
              ? tema.primario
              : tema.texto + "60",
          transition: "all 0.3s ease",
          pointerEvents: "none",
          backgroundColor: lleno ? tema.fondoAlt : "transparent",
          padding: "0 0.25rem",
          borderRadius: "4px",
          zIndex: 2,
        }}
      >
        {label}
        {obligatorio && <span style={{ color: tema.error }}>*</span>}
      </label>

      {/* Select */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActivo(true)}
        onBlur={() => setActivo(false)}
        style={selectStyle}
      >
        <option value=""></option>
        {opciones.map((op) => (
          <option key={op.valor} value={op.valor}>
            {op.etiqueta}
          </option>
        ))}
      </select>

      {/* Icono chevron derecha */}
      <FaChevronDown
        style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          fontSize: "0.9rem",
          color: tema.texto + "40",
          pointerEvents: "none",
          transition: "all 0.3s",
        }}
      />

      {/* Mensaje de error */}
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
    </div>
  );
};

export default CampoSelect;
