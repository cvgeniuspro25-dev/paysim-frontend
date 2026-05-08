// frontend/src/pages/admin/PanelAdmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaHome,
  FaUser,
  FaUsers,
  FaChartBar,
  FaTag,
  FaUserTie,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import MiPerfil from "./modulos/MiPerfil";
import Usuarios from "./modulos/Usuarios";

import { cerebroFront, getTemaActivo } from "../../config/cerebroFront";

// Placeholder: los módulos se importarán dinámicamente según la sección activa
const modulosAdmin = {
  perfil: MiPerfil,
  usuarios: Usuarios,
};

const PanelAdmin = () => {
  const tema = getTemaActivo();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Datos del admin (mock inicial, luego vendrán del backend)
  const [admin, setAdmin] = useState({
    nombre: "Administrador",
    rango: cerebroFront.textos.panelAdmin.sidebar.rango || "Super Admin",
    foto: null,
  });

  // Secciones del menú definidas en el Cerebro (próximo paso)
  const textosPanel = cerebroFront.textos.panelAdmin;
  const secciones = [
    { id: "inicio", label: textosPanel.menu.inicio, Icono: FaHome },
    { id: "perfil", label: textosPanel.menu.perfil, Icono: FaUser },
    { id: "usuarios", label: textosPanel.menu.usuarios, Icono: FaUsers },
    { id: "finanzas", label: textosPanel.menu.finanzas, Icono: FaChartBar },

    { id: "promociones", label: textosPanel.menu.promociones, Icono: FaTag },
    { id: "empleados", label: textosPanel.menu.empleados, Icono: FaUserTie },
  ];

  // Fecha y hora actualizadas
  const [fechaHora, setFechaHora] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!token || usuario.rol !== "admin") {
      navigate("/login");
      return;
    }
    // Cargar foto de perfil del admin
    fetch(`${cerebroFront.getBackendUrl()}/api/admin/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.foto_perfil) {
          setAdmin((prev) => ({ ...prev, foto: data.foto_perfil }));
        }
        if (data.nombre) {
          setAdmin((prev) => ({ ...prev, nombre: data.nombre }));
        }
      })
      .catch(() => {});
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const ModuloActivo = modulosAdmin[seccionActiva];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: tema.fondo,
        color: tema.texto,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? "0px" : "260px",
          minWidth: isMobile ? "0px" : "260px",
          backgroundColor: tema.fondoAlt,
          borderRight: `1px solid ${tema.bordeSuave}`,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "0" : "1.5rem 0",
          overflow: "hidden",
          transition: "width 0.3s ease",
          position: isMobile ? "fixed" : "relative",
          zIndex: 100,
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        {/* Perfil del admin en sidebar */}
        {!isMobile && (
          <div
            style={{
              padding: "0 1.5rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: tema.primario + "20",
                margin: "0 auto 0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                color: tema.primario,
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {admin.foto ? (
                <img
                  src={admin.foto}
                  alt="Perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                admin.nombre.charAt(0).toUpperCase()
              )}
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                margin: "0 0 0.25rem",
              }}
            >
              {admin.nombre}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: tema.primario,
                margin: "0 0 0.5rem",
              }}
            >
              {admin.rango}
            </p>
            <p style={{ fontSize: "0.75rem", opacity: 0.7, margin: 0 }}>
              {fechaHora.toLocaleDateString("es-AR")}
            </p>
            <p style={{ fontSize: "0.75rem", opacity: 0.7, margin: 0 }}>
              {fechaHora.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        )}

        {/* Navegación */}
        <nav style={{ flex: 1, padding: "0 1rem" }}>
          {secciones.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setSeccionActiva(sec.id);
                if (isMobile) setMenuAbierto(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "0.25rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor:
                  seccionActiva === sec.id
                    ? tema.primario + "15"
                    : "transparent",
                color: seccionActiva === sec.id ? tema.primario : tema.texto,
                fontWeight: seccionActiva === sec.id ? "600" : "400",
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
            >
              <sec.Icono style={{ fontSize: "1.2rem" }} />
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div style={{ padding: "0 1rem", marginTop: "auto" }}>
          <button
            onClick={cerrarSesion}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "10px",
              border: `1px solid ${tema.error}40`,
              backgroundColor: "transparent",
              color: tema.error,
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        {/* Top bar mobile */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              padding: "0.5rem 0",
            }}
          >
            <button
              onClick={() => setMenuAbierto(true)}
              style={{
                background: "none",
                border: "none",
                color: tema.texto,
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              <FaBars />
            </button>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
              {secciones.find((s) => s.id === seccionActiva)?.label || "Panel"}
            </h2>
            <div style={{ width: "1.5rem" }} />
          </div>
        )}

        {/* Menú mobile desplegable (de arriba hacia abajo, centrado) */}
        <AnimatePresence>
          {isMobile && menuAbierto && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                overflow: "hidden",
                backgroundColor: tema.fondoAlt,
                borderBottom: `1px solid ${tema.bordeSuave}`,
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <button
                onClick={() => setMenuAbierto(false)}
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  color: tema.texto,
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                <FaTimes />
              </button>
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1rem 0",
                  gap: "0.5rem",
                }}
              >
                {secciones.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setSeccionActiva(sec.id);
                      setMenuAbierto(false);
                    }}
                    style={{
                      width: "80%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor:
                        seccionActiva === sec.id
                          ? tema.primario + "15"
                          : "transparent",
                      color:
                        seccionActiva === sec.id ? tema.primario : tema.texto,
                      fontWeight: seccionActiva === sec.id ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <sec.Icono style={{ fontSize: "1.2rem" }} />
                    {sec.label}
                  </button>
                ))}
                <button
                  onClick={cerrarSesion}
                  style={{
                    width: "80%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: `1px solid ${tema.error}40`,
                    backgroundColor: "transparent",
                    color: tema.error,
                    cursor: "pointer",
                    fontWeight: "600",
                    marginTop: "0.5rem",
                  }}
                >
                  Cerrar Sesión
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Renderizado condicional del módulo activo */}
        {ModuloActivo ? (
          <ModuloActivo />
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {secciones.find((s) => s.id === seccionActiva)?.label}
            </h2>
            <p style={{ opacity: 0.7 }}>Módulo en desarrollo...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PanelAdmin;
