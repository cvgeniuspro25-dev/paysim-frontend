// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaIdCard,
  FaArrowLeft,
} from "react-icons/fa";
import ModalBase from "../components/ModalBase";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";
import CampoFlotante from "../components/CampoFlotante";

const Login = () => {
  const tema = getTemaActivo();
  const textos = cerebroFront.textos.login;
  const estilos = cerebroFront.estilos.registroForm;
  const navigate = useNavigate();

  // Estados del formulario
  const [tabActiva, setTabActiva] = useState("usuario"); // "usuario" | "empleado"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [modoEnviando, setModoEnviando] = useState(false);

  // Modales
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [exitoLogin, setExitoLogin] = useState(false);
  const [modo, setModo] = useState("login"); // "login" | "recordarUsuario" | "recuperarContrasena" | "reenviarActivacion"

  // Estados para modales secundarios
  const [dniRecordar, setDniRecordar] = useState("");
  const [userRecuperar, setUserRecuperar] = useState("");
  const [userReenviar, setUserReenviar] = useState("");
  const [dniReenviar, setDniReenviar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

    if (tabActiva === "usuario" && (!username.trim() || !password.trim())) {
      setFeedbackModal({
        tipo: "error",
        titulo: "Error",
        mensaje: textos.errorCamposVacios,
      });
      return;
    }
    if (tabActiva === "empleado" && !codigoEmpleado.trim()) {
      setFeedbackModal({
        tipo: "error",
        titulo: "Error",
        mensaje: "El código de empleado es obligatorio",
      });
      return;
    }

    setEnviando(true);
    setFeedbackModal(null);

    try {
      const payload =
        tabActiva === "usuario"
          ? { username, password }
          : { codigo_empleado: codigoEmpleado };

      const resp = await fetch(
        `${cerebroFront.getBackendUrl()}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await resp.json();

      if (resp.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        setExitoLogin(true);
      } else {
        let mensaje = data.error || textos.errorServidor;
        if (data.error?.includes("Usuario o contraseña incorrectos")) {
          mensaje = textos.errorUsuarioIncorrecto;
        } else if (data.error?.includes("Cuenta no activada")) {
          mensaje = textos.errorCuentaNoActivada;
        }
        setFeedbackModal({ tipo: "error", titulo: "Error", mensaje });
      }
    } catch {
      setFeedbackModal({
        tipo: "error",
        titulo: "Error",
        mensaje: textos.errorServidor,
      });
    } finally {
      setEnviando(false);
    }
  };

  React.useEffect(() => {
    if (exitoLogin) {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        const esAdmin = usuario && usuario.rol === "admin";
        const destino = esAdmin ? "/admin" : "/";
        const timer = setTimeout(() => navigate(destino), 2000);
        return () => clearTimeout(timer);
      } catch {
        const timer = setTimeout(() => navigate("/"), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [exitoLogin, navigate]);

  const cambiarModo = (nuevoModo) => {
    setDniRecordar("");
    setUserRecuperar("");
    setUserReenviar("");
    setDniReenviar("");
    setModo(nuevoModo);
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
        padding: "2rem 1rem",
      }}
    >
      {/* Modal de feedback genérico */}
      <AnimatePresence>
        {feedbackModal && (
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
              zIndex: 20000,
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
                boxShadow: `0 0 15px ${feedbackModal.tipo === "exito" ? tema.exito : tema.error}60`,
                border: `2px solid ${feedbackModal.tipo === "exito" ? tema.exito : tema.error}`,
              }}
            >
              {feedbackModal.tipo === "exito" ? (
                <FaCheckCircle
                  style={{
                    fontSize: "2.5rem",
                    color: tema.exito,
                    marginBottom: "1rem",
                  }}
                />
              ) : (
                <FaExclamationCircle
                  style={{
                    fontSize: "2.5rem",
                    color: tema.error,
                    marginBottom: "1rem",
                  }}
                />
              )}
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: tema.texto,
                  marginBottom: "0.5rem",
                }}
              >
                {feedbackModal.titulo}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: tema.texto + "80",
                  marginBottom: "1.5rem",
                }}
              >
                {feedbackModal.mensaje}
              </p>
              <button
                onClick={() => setFeedbackModal(null)}
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

      {/* Modal de éxito de login */}
      <AnimatePresence>
        {exitoLogin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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
              {textos.exitoLogin}
            </h2>
            <p style={{ color: tema.texto + "60", fontSize: "0.9rem" }}>
              Serás redirigido en unos segundos...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario dinámico según modo */}
      {!exitoLogin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "450px",
            width: "100%",
            margin: "0 auto",
            padding: "2rem 1.5rem",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "1px solid",
            borderColor: tema.texto + "20",
            backgroundColor: tema.fondo,
          }}
        >
          {/* Encabezado dinámico */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: tema.texto,
              textAlign: "center",
              marginBottom: "0.5rem",
            }}
          >
            {modo === "recordarUsuario"
              ? textos.recordarUsuarioTitulo
              : modo === "reenviarActivacion"
                ? textos.reenviarActivacionTitulo
                : modo === "recuperarContrasena"
                  ? textos.recuperarContrasenaTitulo
                  : textos.titulo}
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: tema.texto + "80",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {modo === "recordarUsuario"
              ? textos.recordarUsuarioMensaje
              : modo === "reenviarActivacion"
                ? textos.reenviarActivacionMensaje
                : modo === "recuperarContrasena"
                  ? textos.recuperarContrasenaMensaje
                  : textos.subtitulo}
          </p>

          {modo === "login" && (
            <>
              {/* Pestañas Usuario / Empleado */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <button
                  onClick={() => {
                    setTabActiva("usuario");
                    setCodigoEmpleado("");
                  }}
                  style={{
                    flex: 1,
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: `1px solid ${tabActiva === "usuario" ? tema.primario : tema.texto + "30"}`,
                    background:
                      tabActiva === "usuario"
                        ? tema.primario + "10"
                        : "transparent",
                    color: tabActiva === "usuario" ? tema.primario : tema.texto,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  <FaUser /> {textos.tabUsuario}
                </button>
                <button
                  onClick={() => setTabActiva("empleado")}
                  style={{
                    flex: 1,
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: `1px solid ${tabActiva === "empleado" ? tema.primario : tema.texto + "30"}`,
                    background:
                      tabActiva === "empleado"
                        ? tema.primario + "10"
                        : "transparent",
                    color:
                      tabActiva === "empleado" ? tema.primario : tema.texto,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  <FaUserTie /> {textos.tabEmpleado}
                </button>
              </div>

              {/* Campos de login */}
              {tabActiva === "usuario" ? (
                <>
                  <CampoFlotante
                    icon={<FaUser />}
                    tipo="text"
                    value={username}
                    onChange={setUsername}
                    label={textos.campoUsername}
                    placeholder={textos.placeholderUsername}
                    tema={tema}
                    estilos={estilos}
                    marginBottom="0.8rem"
                  />
                  <div style={{ position: "relative" }}>
                    <CampoFlotante
                      icon={<FaLock />}
                      tipo={mostrarPassword ? "text" : "password"}
                      value={password}
                      onChange={setPassword}
                      label={textos.campoPassword}
                      placeholder={textos.placeholderPassword}
                      tema={tema}
                      estilos={estilos}
                      marginBottom="0.8rem"
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
                </>
              ) : (
                <CampoFlotante
                  icon={<FaUserTie />}
                  tipo="text"
                  value={codigoEmpleado}
                  onChange={setCodigoEmpleado}
                  label={textos.codigoEmpleado}
                  placeholder={textos.placeholderCodigoEmpleado}
                  tema={tema}
                  estilos={estilos}
                  marginBottom="0.8rem"
                />
              )}

              {/* Botón Ingresar */}
              <button
                type="submit"
                disabled={enviando}
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
                  opacity: enviando ? 0.7 : 1,
                  boxShadow: `0 8px 25px ${tema.primario}35`,
                  transition: "all 0.3s ease",
                  marginBottom: "1.5rem",
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
                  textos.botonIngresar
                )}
              </button>

              {/* Opciones adicionales (solo en pestaña Usuario) */}
              {tabActiva === "usuario" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => cambiarModo("recordarUsuario")}
                    style={{
                      background: "none",
                      border: "none",
                      color: tema.primario,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      textDecoration: "underline",
                    }}
                  >
                    {textos.recordarUsuario}
                  </button>
                  <button
                    onClick={() => cambiarModo("recuperarContrasena")}
                    style={{
                      background: "none",
                      border: "none",
                      color: tema.primario,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      textDecoration: "underline",
                    }}
                  >
                    {textos.recuperarContrasena}
                  </button>
                  <button
                    onClick={() => cambiarModo("reenviarActivacion")}
                    style={{
                      background: "none",
                      border: "none",
                      color: tema.primario,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      textDecoration: "underline",
                    }}
                  >
                    {textos.reenviarActivacion}
                  </button>
                </div>
              )}
            </>
          )}

          {modo === "recordarUsuario" && (
            <>
              <CampoFlotante
                icon={<FaIdCard />}
                tipo="text"
                value={dniRecordar}
                onChange={(val) => setDniRecordar(val.replace(/\D/g, ""))}
                label="DNI"
                placeholder="Ingresá tu DNI"
                tema={tema}
                estilos={estilos}
              />
              <button
                disabled={modoEnviando}
                onClick={async () => {
                  if (!dniRecordar || dniRecordar.length < 7) {
                    setFeedbackModal({
                      tipo: "error",
                      titulo: "Error",
                      mensaje: "Ingresá un DNI válido (7-10 dígitos)",
                    });
                    return;
                  }
                  setModoEnviando(true);
                  try {
                    const resp = await fetch(
                      `${cerebroFront.getBackendUrl()}/api/auth/recordar-usuario`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ dni: dniRecordar }),
                      },
                    );
                    const data = await resp.json();
                    if (resp.ok) {
                      setFeedbackModal({
                        tipo: "exito",
                        titulo: "Éxito",
                        mensaje: data.mensaje,
                      });
                      cambiarModo("login");
                    } else {
                      setFeedbackModal({
                        tipo: "error",
                        titulo: "Error",
                        mensaje: data.error || "Error al procesar",
                      });
                    }
                  } catch {
                    setFeedbackModal({
                      tipo: "error",
                      titulo: "Error",
                      mensaje: "Error de conexión",
                    });
                  } finally {
                    setModoEnviando(false);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "14px",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  background: `linear-gradient(135deg, ${tema.primario} 0%, ${tema.secundario} 100%)`,
                  cursor: "pointer",
                  boxShadow: `0 8px 25px ${tema.primario}35`,
                  marginTop: "0.5rem",
                }}
              >
                {modoEnviando ? (
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
                  textos.botonEnviar
                )}
              </button>
              <button
                onClick={() => cambiarModo("login")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "14px",
                  border: `1px solid ${tema.texto}30`,
                  backgroundColor: "transparent",
                  color: tema.texto,
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                {textos.botonVolverLogin}
              </button>
            </>
          )}

          {modo === "reenviarActivacion" && (
            <>
              <CampoFlotante
                icon={<FaUser />}
                tipo="text"
                value={userReenviar}
                onChange={setUserReenviar}
                label={textos.campoUsername}
                placeholder={textos.placeholderUsername}
                tema={tema}
                estilos={estilos}
              />
              <CampoFlotante
                icon={<FaIdCard />}
                tipo="text"
                value={dniReenviar}
                onChange={(val) => setDniReenviar(val.replace(/\D/g, ""))}
                label={textos.campoDni}
                placeholder={textos.placeholderDni}
                tema={tema}
                estilos={estilos}
              />
              <button
                disabled={modoEnviando}
                onClick={async () => {
                  if (!userReenviar.trim() || !dniReenviar.trim()) {
                    setFeedbackModal({
                      tipo: "error",
                      titulo: "Error",
                      mensaje: "Completá todos los campos",
                    });
                    return;
                  }
                  setModoEnviando(true);
                  try {
                    const resp = await fetch(
                      `${cerebroFront.getBackendUrl()}/api/auth/reenviar-activacion`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          username: userReenviar,
                          dni: dniReenviar,
                        }),
                      },
                    );
                    const data = await resp.json();
                    if (resp.ok) {
                      setFeedbackModal({
                        tipo: "exito",
                        titulo: "Éxito",
                        mensaje: data.mensaje,
                      });
                      cambiarModo("login");
                    } else {
                      setFeedbackModal({
                        tipo: "error",
                        titulo: "Error",
                        mensaje: data.error || "Error al procesar",
                      });
                    }
                  } catch {
                    setFeedbackModal({
                      tipo: "error",
                      titulo: "Error",
                      mensaje: "Error de conexión",
                    });
                  } finally {
                    setModoEnviando(false);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "14px",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  background: `linear-gradient(135deg, ${tema.primario} 0%, ${tema.secundario} 100%)`,
                  cursor: "pointer",
                  boxShadow: `0 8px 25px ${tema.primario}35`,
                  marginTop: "0.5rem",
                }}
              >
                {modoEnviando ? (
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
                  textos.botonEnviar
                )}
              </button>
              <button
                onClick={() => cambiarModo("login")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "14px",
                  border: `1px solid ${tema.texto}30`,
                  backgroundColor: "transparent",
                  color: tema.texto,
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                {textos.botonVolverLogin}
              </button>
            </>
          )}

          {modo === "recuperarContrasena" && (
            <>
              <CampoFlotante
                icon={<FaUser />}
                tipo="text"
                value={userRecuperar}
                onChange={setUserRecuperar}
                label={textos.campoUsername}
                placeholder={textos.placeholderUsername}
                tema={tema}
                estilos={estilos}
              />
              <button
                disabled={modoEnviando}
                onClick={async () => {
                  if (!userRecuperar.trim()) {
                    setFeedbackModal({
                      tipo: "error",
                      titulo: "Error",
                      mensaje: "Ingresá tu nombre de usuario",
                    });
                    return;
                  }
                  setModoEnviando(true);
                  try {
                    const resp = await fetch(
                      `${cerebroFront.getBackendUrl()}/api/auth/recuperar-contrasena`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: userRecuperar }),
                      },
                    );
                    const data = await resp.json();
                    if (resp.ok) {
                      setFeedbackModal({
                        tipo: "exito",
                        titulo: "Éxito",
                        mensaje: data.mensaje,
                      });
                      cambiarModo("login");
                    } else {
                      setFeedbackModal({
                        tipo: "error",
                        titulo: "Error",
                        mensaje: data.error || "Error al procesar",
                      });
                    }
                  } catch {
                    setFeedbackModal({
                      tipo: "error",
                      titulo: "Error",
                      mensaje: "Error de conexión",
                    });
                  } finally {
                    setModoEnviando(false);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "14px",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#FFFFFF",
                  background: `linear-gradient(135deg, ${tema.primario} 0%, ${tema.secundario} 100%)`,
                  cursor: "pointer",
                  boxShadow: `0 8px 25px ${tema.primario}35`,
                  marginTop: "0.5rem",
                }}
              >
                {modoEnviando ? (
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
                  textos.botonEnviar
                )}
              </button>
              <button
                onClick={() => cambiarModo("login")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "14px",
                  border: `1px solid ${tema.texto}30`,
                  backgroundColor: "transparent",
                  color: tema.texto,
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                {textos.botonVolverLogin}
              </button>
            </>
          )}

          {/* Flecha de volver al landing */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            <FaArrowLeft
              onClick={() => {
                cambiarModo("login");
                navigate("/");
              }}
              style={{
                fontSize: "1.2rem",
                color: tema.primario,
                cursor: "pointer",
              }}
            />
          </div>
        </motion.div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
