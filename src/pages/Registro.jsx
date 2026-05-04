// frontend/src/pages/Registro.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaLaptopCode,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import ModalBase from "../components/ModalBase";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";
import CampoFlotante from "../components/CampoFlotante";

const Registro = () => {
  const tema = getTemaActivo();
  const textos = cerebroFront.textos.registro;
  const estilos = cerebroFront.estilos.registroForm;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();

  // Estado del plan
  const [plan, setPlan] = useState(
    () => localStorage.getItem("planSeleccionado") || null,
  );
  const [mostrarModalSinPlan, setMostrarModalSinPlan] = useState(false);

  // Campos
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [terminos, setTerminos] = useState(false);

  // Validaciones asíncronas
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [dniStatus, setDniStatus] = useState(null);

  // Visibilidad de contraseñas
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarPasswordConfirmar, setMostrarPasswordConfirmar] =
    useState(false);

  // Estados de envío
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [modalLegal, setModalLegal] = useState(null); // null | 'privacidad' | 'condiciones'

  const abrirModalLegal = (tipo) => setModalLegal(tipo);
  const cerrarModalLegal = () => setModalLegal(null);

  // Efecto: validar si hay plan al montar
  useEffect(() => {
    if (!plan) {
      setMostrarModalSinPlan(true);
    }
  }, [plan]);

  // Redirigir al landing con ancla a planes
  const irAPlanes = () => {
    window.location.href = "/#planes";
  };

  // Verificar username (debe ser único)
  const verificarUsername = useCallback(async (val) => {
    if (val.length < 6) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus("checking");
    try {
      const resp = await fetch(
        `${cerebroFront.getBackendUrl()}/api/auth/check-username`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: val }),
        },
      );
      const data = await resp.json();
      if (resp.ok && data.disponible) {
        setUsernameStatus("available");
      } else {
        setUsernameStatus("taken");
      }
    } catch {
      setUsernameStatus(null);
    }
  }, []);

  // Verificar DNI (debe ser único)
  const verificarDni = useCallback(async (val) => {
    if (val.length < 7) {
      setDniStatus(null);
      return;
    }
    setDniStatus("checking");
    try {
      const resp = await fetch(
        `${cerebroFront.getBackendUrl()}/api/auth/check-dni`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dni: val }),
        },
      );
      const data = await resp.json();
      if (resp.ok && data.disponible) {
        setDniStatus("available");
      } else {
        setDniStatus("taken");
      }
    } catch {
      setDniStatus(null);
    }
  }, []);

  // Disparar verificación con debounce
  useEffect(() => {
    const timer = setTimeout(() => verificarUsername(username), 500);
    return () => clearTimeout(timer);
  }, [username, verificarUsername]);

  useEffect(() => {
    const timer = setTimeout(() => verificarDni(dni), 500);
    return () => clearTimeout(timer);
  }, [dni, verificarDni]);

  // Determinar si cuenta empresa está disponible
  const empresaHabilitada =
    plan && ["pro", "enterprise"].includes(plan.toLowerCase());

  // Validación de campos
  const camposObligatorios = [
    tipoCuenta,
    nombre,
    apellido,
    username,
    dni,
    email,
    password,
    passwordConfirmar,
  ];
  const camposLlenos = camposObligatorios.every((c) => c.trim() !== "");

  // Fortaleza de contraseña (escala 0-5)
  const calcularFortaleza = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pass)) score++;
    return score;
  };

  const fortaleza = calcularFortaleza(password);

  // Devuelve el color real del tema según la fortaleza
  const getColorSegmento = (indice) => {
    if (password.length === 0) return tema.texto + "15"; // gris de fondo
    if (indice < fortaleza) {
      if (fortaleza <= 2) return tema.error; // rojo
      if (fortaleza === 3) return tema.advertencia; // amarillo
      if (fortaleza === 4) return tema.info; // azul
      return tema.exito; // verde
    }
    return tema.texto + "15";
  };

  const textoFortaleza = () => {
    if (password.length === 0) return "";
    if (fortaleza <= 2) return textos.passwordDebil;
    if (fortaleza === 3) return textos.passwordMedia;
    if (fortaleza === 4) return textos.passwordFuerte;
    return textos.passwordMuyFuerte;
  };

  // Validaciones visuales
  const emailValido = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordCoincide =
    passwordConfirmar === "" || password === passwordConfirmar;

  // Progreso
  const progreso =
    camposObligatorios.filter((c) => c.trim() !== "").length /
    camposObligatorios.length;
  const progresoPorcentaje = Math.round(progreso * 100);

  // Manejar envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

    if (!tipoCuenta) {
      setErrorModal({ titulo: "Error", mensaje: textos.tipoCuentaObligatorio });
      return;
    }
    if (tipoCuenta === "empresa" && !empresaHabilitada) {
      setErrorModal({ titulo: "Error", mensaje: textos.errorTipoCuentaPlan });
      return;
    }
    if (!emailValido) {
      setErrorModal({ titulo: "Error", mensaje: textos.emailInvalido });
      return;
    }
    if (password !== passwordConfirmar) {
      setErrorModal({ titulo: "Error", mensaje: textos.passwordNoCoincide });
      return;
    }
    if (!terminos) {
      setErrorModal({
        titulo: "Error",
        mensaje: "Debés aceptar los Términos y Condiciones.",
      });
      return;
    }

    setEnviando(true);
    setErrorModal(null);

    try {
      const resp = await fetch(
        `${cerebroFront.getBackendUrl()}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            dni,
            email,
            nombre,
            apellido,
            tipoCuenta,
            plan: plan || "free",
          }),
        },
      );
      const data = await resp.json();

      if (resp.ok) {
        localStorage.removeItem("planElegido");
        setExito(true);
      } else {
        let mensaje = data.error || textos.errorServidor;
        if (data.error && data.error.includes("usuario ya está en uso")) {
          mensaje = textos.errorUsernameDuplicado;
        } else if (
          data.error &&
          data.error.includes("DNI ya está registrado")
        ) {
          mensaje = textos.errorDniDuplicado;
        }
        setErrorModal({ titulo: "Error", mensaje });
      }
    } catch {
      setErrorModal({ titulo: "Error", mensaje: textos.errorServidor });
    } finally {
      setEnviando(false);
    }
  };

  // Render
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tema.fondo,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Modal sin plan */}
      <AnimatePresence>
        {mostrarModalSinPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              style={{
                backgroundColor: tema.fondo,
                padding: "2rem",
                borderRadius: "16px",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
                boxShadow: `0 0 15px ${tema.advertencia}60`,
                border: `2px solid ${tema.advertencia}`,
              }}
            >
              <FaExclamationCircle
                style={{
                  fontSize: "3rem",
                  color: tema.advertencia,
                  marginBottom: "1rem",
                }}
              />
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: tema.texto,
                  marginBottom: "0.5rem",
                }}
              >
                {textos.sinPlanTitulo}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: tema.texto + "80",
                  marginBottom: "1.5rem",
                }}
              >
                {textos.sinPlanMensaje}
              </p>
              <button
                onClick={irAPlanes}
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
                {textos.sinPlanBoton}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de error */}
      <AnimatePresence>
        {errorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{
                backgroundColor: tema.fondo,
                padding: "2rem",
                borderRadius: "16px",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
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
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: tema.texto,
                  marginBottom: "0.5rem",
                }}
              >
                {errorModal.titulo}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: tema.texto + "80",
                  marginBottom: "1.5rem",
                }}
              >
                {errorModal.mensaje}
              </p>
              <button
                onClick={() => setErrorModal(null)}
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
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario */}
      {!exito ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "700px",
            width: "100%",
            margin: "0 auto",
            padding: isMobile ? "1.5rem 1rem" : "1.5rem",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "1px solid",
            borderColor: tema.texto + "20",
            backgroundColor: tema.fondo,
          }}
        >
          {/* Título centrado */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: tema.texto,
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            {textos.titulo}
          </h1>

          {/* Card del plan seleccionado (centrado) */}
          {plan && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1rem",
                padding: "0.6rem 1rem",
                borderRadius: "12px",
                background: tema.primario + "10",
                border: `1px solid ${tema.primario}30`,
              }}
            >
              <span style={{ fontSize: "0.85rem", color: tema.texto + "70" }}>
                {textos.planActual}:
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: tema.primario,
                }}
              >
                {cerebroFront.planes[plan]?.nombre || plan}
              </span>
              <span
                onClick={irAPlanes}
                style={{
                  fontSize: "0.85rem",
                  color: tema.primario,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {textos.cambiarPlan}
              </span>
            </div>
          )}

          {/* Selector tipo de cuenta */}
          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}
          >
            <button
              onClick={() => setTipoCuenta("developer")}
              style={{
                flex: 1,
                padding: "1rem 0.5rem",
                borderRadius: "8px",
                border: `1px solid ${tipoCuenta === "developer" ? tema.primario : tema.texto + "30"}`,
                background:
                  tipoCuenta === "developer"
                    ? tema.primario + "10"
                    : "transparent",
                color: tema.texto,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <FaLaptopCode
                style={{
                  color:
                    tipoCuenta === "developer"
                      ? tema.primario
                      : tema.texto + "60",
                }}
              />
              <span>{textos.tipoCuentaDeveloper}</span>
            </button>
            <button
              onClick={() => empresaHabilitada && setTipoCuenta("empresa")}
              disabled={!empresaHabilitada}
              style={{
                flex: 1,
                padding: "1rem 0.5rem",
                borderRadius: "8px",
                border: `1px solid ${tipoCuenta === "empresa" ? tema.primario : tema.texto + "30"}`,
                background:
                  tipoCuenta === "empresa"
                    ? tema.primario + "10"
                    : "transparent",
                color: tema.texto,
                cursor: empresaHabilitada ? "pointer" : "not-allowed",
                opacity: empresaHabilitada ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <FaUserTie
                style={{
                  color:
                    tipoCuenta === "empresa"
                      ? tema.primario
                      : tema.texto + "60",
                }}
              />
              <span>{textos.tipoCuentaEmpresa}</span>
              {!empresaHabilitada && (
                <span style={{ fontSize: "0.7rem", color: tema.texto + "40" }}>
                  {textos.tipoCuentaNoDisponible}
                </span>
              )}
            </button>
          </div>
          {!tipoCuenta && (
            <div
              style={{
                color: tema.error,
                fontSize: "0.8rem",
                marginTop: "-0.5rem",
                marginBottom: "0.8rem",
                textAlign: "center",
              }}
            >
              {textos.tipoCuentaObligatorio}
            </div>
          )}

          {/* Grid de campos responsivo */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            {/* Fila 1: Nombre y Apellido */}
            <CampoFlotante
              icon={<FaUser />}
              tipo="text"
              value={nombre}
              onChange={setNombre}
              label={textos.campoNombre}
              placeholder={textos.placeholderNombre}
              obligatorio
              tema={tema}
              estilos={estilos}
            />
            <CampoFlotante
              icon={<FaUser />}
              tipo="text"
              value={apellido}
              onChange={setApellido}
              label={textos.campoApellido}
              placeholder={textos.placeholderApellido}
              obligatorio
              tema={tema}
              estilos={estilos}
            />

            {/* Fila 2: Username y DNI */}
            <CampoFlotante
              icon={<FaUser />}
              tipo="text"
              value={username}
              onChange={(val) => {
                const sinEspacios = val.replace(/\s/g, "");
                setUsername(sinEspacios);
                setUsernameStatus(null);
              }}
              label={textos.campoUsername}
              placeholder={textos.placeholderUsername}
              obligatorio
              tema={tema}
              estilos={estilos}
              error={
                username.length > 0 && username.length < 6
                  ? "Mínimo 6 caracteres"
                  : null
              }
              validacion={
                username.length >= 6 && usernameStatus === "checking"
                  ? {
                      tipo: "checking",
                      texto: textos.usernameVerificando,
                      color: tema.info,
                    }
                  : username.length >= 6 && usernameStatus === "available"
                    ? {
                        tipo: "valido",
                        texto: textos.usernameDisponible,
                        color: tema.exito,
                      }
                    : username.length >= 6 && usernameStatus === "taken"
                      ? {
                          tipo: "error",
                          texto: textos.usernameNoDisponible,
                          color: tema.error,
                        }
                      : null
              }
            />
            <CampoFlotante
              icon={<FaIdCard />}
              tipo="text"
              value={dni}
              onChange={(val) => {
                // Solo permitir números
                const soloNumeros = val.replace(/\D/g, "");
                setDni(soloNumeros);
                setDniStatus(null);
              }}
              label={textos.campoDni}
              placeholder={textos.placeholderDni}
              obligatorio
              tema={tema}
              estilos={estilos}
              error={
                dni.length > 0 && (dni.length < 7 || dni.length > 10)
                  ? "El DNI debe tener entre 7 y 10 dígitos"
                  : null
              }
              validacion={
                dniStatus === "checking"
                  ? {
                      tipo: "checking",
                      texto: textos.dniVerificando,
                      color: tema.info,
                    }
                  : dniStatus === "available"
                    ? {
                        tipo: "valido",
                        texto: textos.dniDisponible,
                        color: tema.exito,
                      }
                    : dniStatus === "taken"
                      ? {
                          tipo: "error",
                          texto: textos.dniNoDisponible,
                          color: tema.error,
                        }
                      : null
              }
            />

            {/* Email ocupa ancho completo (col-span 2) */}
            <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
              <CampoFlotante
                icon={<FaEnvelope />}
                tipo="email"
                value={email}
                onChange={setEmail}
                label={textos.campoEmail}
                placeholder={textos.placeholderEmail}
                obligatorio
                tema={tema}
                estilos={estilos}
                error={
                  email !== "" && !emailValido ? textos.emailInvalido : null
                }
              />
            </div>

            {/* Contraseña y Confirmar contraseña en dos columnas */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <CampoFlotante
                  icon={<FaLock />}
                  tipo={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  label={textos.campoPassword}
                  placeholder={textos.placeholderPassword}
                  obligatorio
                  tema={tema}
                  estilos={estilos}
                  error={
                    password.length > 0 && fortaleza <= 2
                      ? "La contraseña es demasiado débil"
                      : null
                  }
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
              {/* Barra de fortaleza justo debajo del campo contraseña */}
              <div style={{ marginTop: "0.3rem" }}>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "4px",
                        borderRadius: "2px",
                        backgroundColor: getColorSegmento(i),
                        transition: "background-color 0.3s",
                      }}
                    />
                  ))}
                </div>
                {password.length > 0 && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "0.3rem",
                      color: tema.texto + "80",
                    }}
                  >
                    {textoFortaleza()}
                  </div>
                )}
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <CampoFlotante
                icon={<FaLock />}
                tipo={mostrarPasswordConfirmar ? "text" : "password"}
                value={passwordConfirmar}
                onChange={setPasswordConfirmar}
                label={textos.campoPasswordConfirmar}
                placeholder={textos.placeholderPasswordConfirmar}
                obligatorio
                tema={tema}
                estilos={estilos}
                error={
                  passwordConfirmar !== "" && !passwordCoincide
                    ? textos.passwordNoCoincide
                    : null
                }
              />
              <span
                onClick={() =>
                  setMostrarPasswordConfirmar(!mostrarPasswordConfirmar)
                }
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "1rem",
                  cursor: "pointer",
                  color: tema.texto + "60",
                  fontSize: "1.2rem",
                }}
              >
                {mostrarPasswordConfirmar ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Checkbox términos (centrado) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "0.8rem",
              marginBottom: "0.8rem",
            }}
          >
            <input
              type="checkbox"
              checked={terminos}
              onChange={(e) => setTerminos(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: tema.primario,
              }}
            />
            <span style={{ fontSize: "0.85rem", color: tema.texto }}>
              {textos.terminosTexto}{" "}
              <span
                onClick={() => abrirModalLegal("condiciones")}
                style={{
                  color: estilos.terminosLinkColor,
                  cursor: "pointer",
                  textDecoration: estilos.terminosLinkTextDecoration,
                }}
              >
                {textos.terminosLink}
              </span>{" "}
              {textos.y}{" "}
              <span
                onClick={() => abrirModalLegal("privacidad")}
                style={{
                  color: estilos.terminosLinkColor,
                  cursor: "pointer",
                  textDecoration: estilos.terminosLinkTextDecoration,
                }}
              >
                {textos.privacidadLink}
              </span>
            </span>
          </div>

          {/* Barra de progreso */}
          <div
            style={{
              height: "4px",
              borderRadius: "4px",
              backgroundColor: tema.texto + "15",
              marginBottom: "0.8rem",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: "4px",
                background: `linear-gradient(90deg, ${tema.primario}, ${tema.secundario})`,
                width: `${progresoPorcentaje}%`,
              }}
            />
          </div>

          {/* Botón Registrarme (centrado) */}
          <button
            type="submit"
            disabled={
              !camposLlenos ||
              enviando ||
              !terminos ||
              usernameStatus === "taken" ||
              dniStatus === "taken" ||
              !emailValido ||
              !passwordCoincide
            }
            onClick={handleSubmit}
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
              opacity:
                !camposLlenos ||
                enviando ||
                !terminos ||
                usernameStatus === "taken" ||
                dniStatus === "taken" ||
                !emailValido ||
                !passwordCoincide
                  ? 0.5
                  : 1,
              boxShadow: `0 8px 25px ${tema.primario}35`,
              transition: "all 0.3s ease",
              marginBottom: "0.8rem",
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
                {textos.botonProcesando}
              </>
            ) : (
              textos.botonRegistrarme
            )}
          </button>

          {/* Flecha de volver (más chica, debajo del botón) */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <FaArrowLeft
              onClick={() => navigate("/")}
              style={{
                fontSize: "1.2rem",
                color: tema.primario,
                cursor: "pointer",
              }}
            />
          </div>
        </motion.div>
      ) : (
        /* Éxito */
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle
              style={{
                fontSize: "4rem",
                color: tema.exito,
                marginBottom: "1rem",
              }}
            />
          </motion.div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: tema.texto,
              marginBottom: "0.5rem",
            }}
          >
            {textos.exitoTitulo}
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: tema.texto + "80",
              maxWidth: "400px",
              margin: "0 auto 2rem",
            }}
          >
            {textos.exitoMensaje}
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
              fontSize: "1rem",
            }}
          >
            {textos.exitoBoton}
          </button>
        </motion.div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      {/* Modales legales */}
      {modalLegal && (
        <ModalBase
          isOpen={!!modalLegal}
          onClose={cerrarModalLegal}
          titulo={
            modalLegal === "privacidad"
              ? cerebroFront.textos.politicaPrivacidad.titulo
              : cerebroFront.textos.condicionesServicio.titulo
          }
        >
          <div>
            {(modalLegal === "privacidad"
              ? cerebroFront.textos.politicaPrivacidad.contenido
              : cerebroFront.textos.condicionesServicio.contenido
            ).map((p, i) => (
              <p
                key={i}
                style={{
                  marginBottom: "0.8rem",
                  textAlign: "left",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </ModalBase>
      )}
    </div>
  );
};

export default Registro;
