// frontend/src/pages/CambiarContrasena.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const CampoFlotante = ({
  icon,
  tipo,
  value,
  onChange,
  label,
  placeholder,
  error,
  tema,
}) => {
  const [activo, setActivo] = useState(false);
  const lleno = value.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: "0.8rem" }}>
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
      </label>
      <input
        type={tipo}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActivo(true)}
        onBlur={() => setActivo(false)}
        placeholder={activo ? placeholder : ""}
        style={{
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
    </div>
  );
};

const CambiarContrasena = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const tema = getTemaActivo();
  const textos = cerebroFront.textos.login;

  const [estado, setEstado] = useState("verificando"); // verificando | valido | invalido | exito
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const verificar = async () => {
      try {
        const resp = await fetch(
          `${cerebroFront.getBackendUrl()}/api/auth/validar-token-recuperacion/${token}`,
        );
        const data = await resp.json();
        if (data.valido) {
          setEstado("valido");
        } else {
          setEstado("invalido");
          setMensaje(data.error || "Token inválido");
        }
      } catch {
        setEstado("invalido");
        setMensaje("Error de conexión");
      }
    };
    verificar();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setMensaje(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
      );
      return;
    }
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);
    try {
      const resp = await fetch(
        `${cerebroFront.getBackendUrl()}/api/auth/cambiar-contrasena`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        },
      );
      const data = await resp.json();
      if (resp.ok) {
        setEstado("exito");
      } else {
        setMensaje(data.error || "Error al cambiar la contraseña");
      }
    } catch {
      setMensaje("Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

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
      {estado === "verificando" && (
        <>
          <FaSpinner
            style={{
              fontSize: "2rem",
              color: tema.primario,
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <p style={{ color: tema.texto }}>Verificando token...</p>
        </>
      )}

      {estado === "invalido" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
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
            onClick={() => navigate("/login")}
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
            Ir al inicio de sesión
          </button>
        </motion.div>
      )}

      {estado === "valido" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: "450px",
            width: "100%",
            padding: "2rem 1.5rem",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: `1px solid ${tema.texto}20`,
            backgroundColor: tema.fondo,
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: tema.texto,
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {textos.cambiarContrasenaTitulo}
          </h1>
          <div style={{ position: "relative" }}>
            <CampoFlotante
              icon={<FaLock />}
              tipo={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              label="Nueva contraseña"
              placeholder="Mín. 8 caracteres, mayúscula, minúscula, número"
              tema={tema}
            />
            <span
              onClick={() => setMostrarPassword(!mostrarPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "1rem",
                cursor: "pointer",
                color: tema.texto + "60",
                fontSize: "1.2rem",
              }}
            >
              {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <CampoFlotante
            icon={<FaLock />}
            tipo="password"
            value={confirmar}
            onChange={setConfirmar}
            label="Confirmar contraseña"
            placeholder="Repetí tu contraseña"
            tema={tema}
          />
          {mensaje && (
            <p
              style={{
                color: tema.error,
                fontSize: "0.85rem",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {mensaje}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={enviando}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "14px",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#FFFFFF",
              background: `linear-gradient(135deg, ${tema.primario} 0%, ${tema.secundario} 100%)`,
              cursor: enviando ? "not-allowed" : "pointer",
              opacity: enviando ? 0.7 : 1,
              boxShadow: `0 8px 25px ${tema.primario}35`,
            }}
          >
            {enviando ? (
              <>
                <FaSpinner
                  style={{
                    animation: "spin 1s linear infinite",
                    marginRight: "0.5rem",
                  }}
                />
                Procesando...
              </>
            ) : (
              "Cambiar contraseña"
            )}
          </button>
        </motion.div>
      )}

      {estado === "exito" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
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
            ¡Contraseña cambiada!
          </h2>
          <p style={{ color: tema.texto + "80" }}>
            {textos.cambiarContrasenaExito}
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "1.5rem",
              padding: "0.8rem 2rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: tema.primario,
              color: "#FFFFFF",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Ir al inicio de sesión
          </button>
        </motion.div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CambiarContrasena;
