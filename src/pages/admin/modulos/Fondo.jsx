// frontend/src/pages/admin/modulos/Fondo.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaHistory,
  FaChartLine,
  FaHandHoldingUsd,
  FaSpinner,
  FaExclamationCircle,
  FaSearch,
  FaPiggyBank,
} from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../../../config/cerebroFront";

const Fondo = () => {
  const tema = getTemaActivo();
  const textos = cerebroFront.textos.panelAdmin?.fondo || {};
  const backendUrl = cerebroFront.getBackendUrl();
  const token = localStorage.getItem("token");

  const [fondo, setFondo] = useState({
    saldo_tokens: 0,
    invertido_tokens: 0,
    gotas_acumuladas: 0,
    gota_diaria: null,
    movimientos: [],
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState("saldo"); // "saldo" | "inversion" | "goteo" | "acumulado" | "movimientos"
  const [montoInvertir, setMontoInvertir] = useState("");
  const [inversionMensaje, setInversionMensaje] = useState(null);

  // Buscador de movimientos
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/fondo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => resp.json())
      .then((data) => setFondo(data))
      .catch(() => setError("No se pudo cargar la información del fondo."))
      .finally(() => setCargando(false));
  }, [backendUrl, token]);

  const ejecutarInversion = async () => {
    if (!montoInvertir) return;
    setInversionMensaje(null);
    try {
      const resp = await fetch(`${backendUrl}/api/admin/fondo/invertir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ monto: parseInt(montoInvertir, 10) }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error al invertir");
      // Recargar fondo
      fetch(`${backendUrl}/api/admin/fondo`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((resp) => resp.json())
        .then((data) => setFondo(data));
      setInversionMensaje({ tipo: "exito", texto: data.mensaje });
      setMontoInvertir("");
    } catch (err) {
      setInversionMensaje({ tipo: "error", texto: err.message });
    }
  };

  const buscarMovimientos = async () => {
    if (!terminoBusqueda) return;
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/fondo/buscar-movimiento?termino=${encodeURIComponent(terminoBusqueda)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);
      setResultadosBusqueda(data.movimientos);
    } catch (err) {
      setResultadosBusqueda(null);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const pestañas = [
    {
      id: "saldo",
      label: textos.pestanaSaldo || "Saldo",
      Icono: FaMoneyBillWave,
    },
    {
      id: "inversion",
      label: textos.pestanaInversion || "Invertir",
      Icono: FaChartLine,
    },
    {
      id: "goteo",
      label: textos.pestanaGoteo || "Goteo",
      Icono: FaHandHoldingUsd,
    },
    {
      id: "acumulado",
      label: textos.pestanaAcumulado || "Acumulado",
      Icono: FaPiggyBank,
    },
    {
      id: "movimientos",
      label: textos.pestanaMovimientos || "Movimientos",
      Icono: FaHistory,
    },
  ];

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: tema.texto }}>
        <FaSpinner
          style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}
        />
        <p style={{ marginTop: "1rem" }}>Cargando fondo...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: tema.error }}>
        <FaExclamationCircle
          style={{ fontSize: "2rem", marginBottom: "1rem" }}
        />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: "1000px", margin: "0 auto", color: tema.texto }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        {textos.titulo || "Fondo"}
      </h2>

      {/* Pestañas */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          borderBottom: `1px solid ${tema.bordeSuave}`,
          paddingBottom: "1rem",
        }}
      >
        {pestañas.map((pest) => (
          <button
            key={pest.id}
            onClick={() => {
              setPestanaActiva(pest.id);
              setResultadosBusqueda(null);
              setTerminoBusqueda("");
            }}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: `1px solid ${pestanaActiva === pest.id ? tema.primario : tema.bordeSuave}`,
              backgroundColor:
                pestanaActiva === pest.id
                  ? tema.primario + "20"
                  : "transparent",
              color: pestanaActiva === pest.id ? tema.primario : tema.texto,
              fontWeight: "500",
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            <pest.Icono /> {pest.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div
        style={{
          backgroundColor: tema.fondoAlt,
          borderRadius: "16px",
          padding: "2rem",
          border: `1px solid ${tema.bordeSuave}`,
        }}
      >
        {pestanaActiva === "saldo" && (
          <>
            <FaMoneyBillWave
              style={{
                fontSize: "2rem",
                color: tema.primario,
                marginBottom: "1rem",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: tema.texto + "70" }}>
              {textos.saldoTotal || "Saldo total del fondo"}
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: tema.primario,
                margin: "0 0 0.5rem",
              }}
            >
              {fondo.saldo_tokens.toLocaleString("es-AR")} tokens
            </p>
            <p style={{ fontSize: "0.8rem", color: tema.texto + "50" }}>
              {textos.disponibleParaInvertir ||
                "Este monto está disponible para invertir"}
            </p>
          </>
        )}

        {pestanaActiva === "inversion" && (
          <>
            <FaChartLine
              style={{
                fontSize: "2rem",
                color: tema.secundario,
                marginBottom: "1rem",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: tema.texto + "70" }}>
              {textos.invertido || "Total invertido"}:{" "}
              <strong>
                {fondo.invertido_tokens.toLocaleString("es-AR")} tokens
              </strong>
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: tema.texto + "50",
                marginBottom: "1.5rem",
              }}
            >
              {textos.tasaAnual || "Tasa: 40% anual"} |{" "}
              {textos.horarioInversion ||
                "Operaciones permitidas entre las 15:00 y 23:59"}
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                maxWidth: "400px",
                marginBottom: "1rem",
              }}
            >
              <input
                type="number"
                value={montoInvertir}
                onChange={(e) => setMontoInvertir(e.target.value)}
                placeholder={textos.placeholderInvertir || "Monto a invertir"}
                style={{
                  flex: 1,
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  border: `1px solid ${tema.bordeSuave}`,
                  backgroundColor: tema.fondoAlt,
                  color: tema.texto,
                  fontSize: "0.95rem",
                }}
              />
              <button
                onClick={ejecutarInversion}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: tema.secundario,
                  color: "#FFFFFF",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {textos.invertir || "Invertir"}
              </button>
            </div>
            {inversionMensaje && (
              <p
                style={{
                  color:
                    inversionMensaje.tipo === "exito" ? tema.exito : tema.error,
                  fontWeight: "600",
                }}
              >
                {inversionMensaje.texto}
              </p>
            )}
          </>
        )}

        {pestanaActiva === "goteo" && (
          <>
            <FaHandHoldingUsd
              style={{
                fontSize: "2rem",
                color: tema.exito,
                marginBottom: "1rem",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: tema.texto + "70" }}>
              {textos.gotaDiaria || "Gota diaria generada hoy"}
            </p>
            {fondo.gota_diaria ? (
              <div>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: tema.exito,
                    margin: "0.5rem 0",
                  }}
                >
                  +{fondo.gota_diaria.cantidad.toLocaleString("es-AR")} tokens
                </p>
                <p style={{ fontSize: "0.8rem", color: tema.texto + "50" }}>
                  {textos.fecha || "Fecha"}:{" "}
                  {formatearFecha(fondo.gota_diaria.fecha)}
                </p>
              </div>
            ) : (
              <p style={{ color: tema.texto + "60" }}>
                {textos.sinGoteo || "Aún no se ha registrado el goteo de hoy."}
              </p>
            )}
          </>
        )}

        {pestanaActiva === "acumulado" && (
          <>
            <FaPiggyBank
              style={{
                fontSize: "2rem",
                color: tema.info,
                marginBottom: "1rem",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: tema.texto + "70" }}>
              {textos.gotasAcumuladas || "Gotas acumuladas totales"}
            </p>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: tema.info,
                margin: 0,
              }}
            >
              {fondo.gotas_acumuladas.toLocaleString("es-AR")} tokens
            </p>
          </>
        )}

        {pestanaActiva === "movimientos" && (
          <>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                placeholder={
                  textos.placeholderBuscarMovimiento ||
                  "Buscar por usuario o DNI"
                }
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: `1px solid ${tema.bordeSuave}`,
                  backgroundColor: tema.fondoAlt,
                  color: tema.texto,
                }}
              />
              <button
                onClick={buscarMovimientos}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: tema.primario,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <FaSearch /> {textos.buscar || "Buscar"}
              </button>
            </div>
            {(resultadosBusqueda || fondo.movimientos).length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.85rem",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: `2px solid ${tema.bordeSuave}` }}>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      {textos.fecha || "Fecha"}
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      {textos.usuarioOrigen || "Usuario"}
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      {textos.dni || "DNI"}
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>
                      {textos.cantidad || "Cant."}
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      {textos.motivo || "Motivo"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(resultadosBusqueda && resultadosBusqueda.length > 0
                    ? resultadosBusqueda
                    : fondo.movimientos
                  ).map((mov, idx) => (
                    <tr
                      key={idx}
                      style={{ borderBottom: `1px solid ${tema.bordeSuave}` }}
                    >
                      <td style={{ padding: "0.4rem" }}>
                        {mov.created_at ? formatearFecha(mov.created_at) : "—"}
                      </td>
                      <td style={{ padding: "0.4rem" }}>
                        {mov.usuario_origen_username || "—"}
                      </td>
                      <td style={{ padding: "0.4rem" }}>
                        {mov.usuario_origen_dni || "—"}
                      </td>
                      <td
                        style={{
                          padding: "0.4rem",
                          textAlign: "right",
                          fontWeight: "600",
                        }}
                      >
                        {mov.cantidad}
                      </td>
                      <td style={{ padding: "0.4rem", fontSize: "0.8rem" }}>
                        {mov.motivo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: tema.texto + "60" }}>
                {textos.sinMovimientos || "No hay movimientos."}
              </p>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Fondo;
