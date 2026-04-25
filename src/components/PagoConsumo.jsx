// frontend/src/components/PagoConsumo.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaCoins,
  FaFileInvoice,
  FaBell,
  FaCheckCircle,
  FaTable,
} from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const PagoConsumo = ({ onClose, onSelectPlan, temaModal }) => {
  const tema = temaModal || getTemaActivo();
  const textos = cerebroFront.textos.pagoConsumo;
  const tabla = cerebroFront.tablaPreciosTokens;

  const itemStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    alignItems: "flex-start",
  };

  const iconBox = {
    minWidth: "40px",
    height: "40px",
    borderRadius: "10px",
    background: `${tema.primario}15`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tema.primario,
    fontSize: "1.2rem",
  };

  const estilosPago = cerebroFront.estilos.pagoConsumo;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        color: tema.texto,
        textAlign: estilosPago.textAlign,
        fontSize: estilosPago.fontSize,
      }}
    >
      <p style={{ marginBottom: "2rem", lineHeight: 1.6 }}>
        {textos.descripcion}
      </p>

      <h3 style={{ color: tema.primario, marginBottom: "1rem" }}>
        {textos.comoFunciona}
      </h3>

      <div style={itemStyle}>
        <div style={iconBox}>
          <FaCreditCard />
        </div>
        <div>
          <strong>{textos.paso1}</strong>
        </div>
      </div>

      <div style={itemStyle}>
        <div style={iconBox}>
          <FaCoins />
        </div>
        <div>
          <strong>{textos.paso2}</strong>
        </div>
      </div>

      <div style={itemStyle}>
        <div style={iconBox}>
          <FaFileInvoice />
        </div>
        <div>
          <strong>{textos.paso3}</strong>
        </div>
      </div>

      <div style={itemStyle}>
        <div style={iconBox}>
          <FaCheckCircle />
        </div>
        <div>
          <strong>{textos.paso4}</strong>
        </div>
      </div>

      <div
        style={{
          ...itemStyle,
          background: `${tema.advertencia}10`,
          padding: "1rem",
          borderRadius: "12px",
          borderLeft: `4px solid ${tema.advertencia}`,
        }}
      >
        <div
          style={{
            ...iconBox,
            background: `${tema.advertencia}20`,
            color: tema.advertencia,
          }}
        >
          <FaBell />
        </div>
        <div>
          <strong>{textos.aviso}</strong>
        </div>
      </div>

      <p style={{ marginTop: "1.5rem", lineHeight: 1.6 }}>
        {textos.renovacion}
      </p>
      <p style={{ marginTop: "1rem", lineHeight: 1.6 }}>{textos.tokens}</p>

      <div
        style={{
          background: `${tema.primario}10`,
          padding: "1rem",
          borderRadius: "12px",
          marginTop: "1.5rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{textos.equivalencia}</p>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h4
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: tema.primario,
            marginBottom: "1rem",
          }}
        >
          <FaTable /> {textos.tablaPrecios}
        </h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: `2px solid ${tema.primario}` }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem",
                    color: tema.primario,
                  }}
                >
                  {textos.columnaCantidad}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem",
                    color: tema.primario,
                  }}
                >
                  {textos.columnaPrecio}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem",
                    color: tema.primario,
                  }}
                >
                  {textos.columnaEjemplo}
                </th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((fila, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${tema.texto}15` }}
                >
                  <td style={{ padding: "0.5rem" }}>
                    {fila.desde === fila.hasta
                      ? fila.desde
                      : `${fila.desde} - ${fila.hasta}`}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    AR$ {fila.precioUnitarioARS}
                  </td>
                  <td style={{ textAlign: "right", padding: "0.5rem" }}>
                    {fila.desde === 1
                      ? `1 token = AR$ ${fila.precioUnitarioARS}`
                      : `${fila.desde} tokens = AR$ ${(fila.desde * fila.precioUnitarioARS).toLocaleString("es-AR")}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            border: `1px solid ${tema.primario}`,
            background: "transparent",
            color: tema.primario,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {textos.botonCerrar}
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.setItem("planSeleccionado", "payAsYouGo");
            // Pequeña pausa para asegurar la escritura antes de redirigir
            setTimeout(() => {
              window.location.href = "/registro";
            }, 50);
          }}
          style={{
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: tema.primario,
            color: tema.textoInverso,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Seleccionar Plan
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PagoConsumo;
