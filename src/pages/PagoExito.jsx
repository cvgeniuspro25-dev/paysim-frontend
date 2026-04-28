// frontend/src/pages/PagoExito.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const PagoExito = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tema = getTemaActivo();
  const [estado, setEstado] = useState("confirmando"); // confirmando | exito | error
  const [mensaje, setMensaje] = useState("");

  const ref = searchParams.get("ref");
  const transactionId = searchParams.get("transaction_id");
  const cardId = searchParams.get("card_id") || "";
  const cardToken = searchParams.get("card_token") || "";

  useEffect(() => {
    if (!ref || !transactionId) {
      setEstado("error");
      setMensaje("Faltan datos de la transacción.");
      return;
    }

    const confirmar = async () => {
      try {
        const resp = await fetch(
          `${cerebroFront.urls.backendLocal}/api/auth/confirmar-pago`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ref,
              transaction_id: transactionId,
              card_token: cardToken,
              card_id: cardId,
            }),
          },
        );
        const data = await resp.json();
        if (resp.ok && (data.activada || data.ya_activada)) {
          setEstado("exito");
          setMensaje(
            data.mensaje ||
              "Cuenta activada. Redirigiendo al inicio de sesión.",
          );
        } else {
          setEstado("error");
          setMensaje(data.error || "Error al confirmar el pago.");
        }
      } catch {
        setEstado("error");
        setMensaje("Error de conexión con el servidor.");
      }
    };

    confirmar();
  }, [ref, transactionId]);

  // Redirigir al login tras éxito
  useEffect(() => {
    if (estado === "exito") {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [estado, navigate]);

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
      {estado === "confirmando" && (
        <>
          <FaSpinner
            style={{
              fontSize: "2rem",
              color: tema.primario,
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <p style={{ color: tema.texto }}>Confirmando pago...</p>
        </>
      )}

      {estado === "exito" && (
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
            boxShadow: `0 0 15px ${tema.exito}60`,
            border: `2px solid ${tema.exito}`,
          }}
        >
          <FaCheckCircle
            style={{
              fontSize: "4rem",
              color: tema.exito,
              marginBottom: "1rem",
            }}
          />
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: tema.texto,
              marginBottom: "0.5rem",
            }}
          >
            ¡Pago confirmado!
          </h2>
          <p style={{ color: tema.texto + "80", marginBottom: "1rem" }}>
            {mensaje}
          </p>
          <p style={{ color: tema.texto + "60", fontSize: "0.9rem" }}>
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
        </motion.div>
      )}

      {estado === "error" && (
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
            boxShadow: `0 0 15px ${tema.error}60`,
            border: `2px solid ${tema.error}`,
          }}
        >
          <FaExclamationCircle
            style={{
              fontSize: "2.5rem",
              color: tema.error,
              marginBottom: "1rem",
            }}
          />
          <h2 style={{ color: tema.error, marginBottom: "0.5rem" }}>Error</h2>
          <p style={{ color: tema.texto + "80", marginBottom: "2rem" }}>
            {mensaje}
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: tema.primario,
              color: "#FFFFFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </motion.div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PagoExito;
