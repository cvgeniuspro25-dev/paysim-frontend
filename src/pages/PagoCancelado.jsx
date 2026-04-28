// frontend/src/pages/PagoCancelado.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const PagoCancelado = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tema = getTemaActivo();

  const status = searchParams.get("status") || "cancelled";
  const message = searchParams.get("message") || "";
  const ref = searchParams.get("ref") || "";

  // Extraer token del ref (formato: user_ID_token_TOKEN)
  const token = ref.includes("_token_") ? ref.split("_token_")[1] : null;

  const esLimiteExcedido = status === "limit_exceeded";
  const esRechazado = status === "rejected";
  const esRobadaOPerdida =
    esRechazado &&
    (message.toLowerCase().includes("robada") ||
      message.toLowerCase().includes("perdida"));

  const [invalidando, setInvalidando] = useState(false);

  // Invalidar token en casos irreversibles
  useEffect(() => {
    if ((esRobadaOPerdida || esLimiteExcedido) && token && !invalidando) {
      setInvalidando(true);
      fetch(`${cerebroFront.getBackendUrl()}/api/auth/invalidar-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => {});
    }
  }, [esRobadaOPerdida, esLimiteExcedido, token, invalidando]);

  let titulo = "Pago cancelado";
  let descripcion =
    message ||
    "El pago fue cancelado. Podés intentarlo nuevamente desde el enlace de activación en tu correo.";
  let colorBorde = tema.advertencia;
  let Icono = FaTimesCircle;

  if (esRobadaOPerdida) {
    titulo = "Tarjeta inválida";
    descripcion =
      "La tarjeta fue reportada como robada o perdida. No podés continuar con este medio de pago. El enlace de activación ha sido invalidado.";
    colorBorde = tema.error;
    Icono = FaExclamationCircle;
  } else if (esLimiteExcedido) {
    titulo = "Límite de intentos superado";
    descripcion =
      "Se superó el número máximo de intentos. El enlace de activación ha sido invalidado. Podés solicitar uno nuevo desde el inicio de sesión.";
    colorBorde = tema.error;
    Icono = FaExclamationCircle;
  } else if (esRechazado) {
    titulo = "Pago rechazado";
    descripcion =
      message ||
      "El pago fue rechazado. Podés intentarlo nuevamente con otra tarjeta.";
    colorBorde = tema.error;
    Icono = FaExclamationCircle;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tema.fondo,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
        style={{
          textAlign: "center",
          padding: "2rem",
          maxWidth: "500px",
          backgroundColor: tema.fondo,
          borderRadius: "16px",
          boxShadow: `0 0 15px ${colorBorde}60`,
          border: `2px solid ${colorBorde}`,
        }}
      >
        <Icono
          style={{
            fontSize: "2.5rem",
            color: colorBorde,
            marginBottom: "1rem",
          }}
        />
        <h2
          style={{
            color: colorBorde,
            marginBottom: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {titulo}
        </h2>
        <p style={{ color: tema.texto + "80", marginBottom: "2rem" }}>
          {descripcion}
        </p>

        {esRobadaOPerdida ? (
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: tema.error,
              color: "#FFFFFF",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Aceptar
          </button>
        ) : esLimiteExcedido ? (
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: tema.primario,
              color: "#FFFFFF",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Ir al inicio de sesión
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "0.8rem 2rem",
                borderRadius: "10px",
                border: `1px solid ${tema.texto}30`,
                backgroundColor: "transparent",
                color: tema.texto,
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Ir al inicio
            </button>
            {token && (
              <button
                onClick={() => navigate(`/activar/${token}`)}
                style={{
                  padding: "0.8rem 2rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: tema.primario,
                  color: "#FFFFFF",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Reintentar pago
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PagoCancelado;
