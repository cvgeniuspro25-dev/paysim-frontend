// frontend/src/components/DemoPanel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRocket,
  FaCreditCard,
  FaWallet,
  FaUsers,
  FaEnvelope,
  FaCog,
  FaPlus,
  FaCheckCircle,
  FaPaperPlane,
  FaSearch,
  FaHome,
  FaCoins,
  FaUser,
  FaIdCard,
  FaCalendar,
  FaLock,
  FaArrowRight,
  FaTrash,
  FaUserPlus,
  FaEye,
  FaRegEnvelope,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { cerebroFront } from "../config/cerebroFront";

const DemoPanel = () => {
  const estilos = cerebroFront.estilos.demoPanel;
  const data = cerebroFront.textos.verDemo;
  const [seccion, setSeccion] = useState("dashboard");
  const [particulas, setParticulas] = useState([]);
  const [tarjetaHover, setTarjetaHover] = useState(null);

  useEffect(() => {
    if (particulas.length > 0) {
      const timer = setTimeout(() => setParticulas([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [particulas]);

  const lanzarParticulas = (origenX, origenY, destinoX, destinoY) => {
    const nuevas = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: origenX + (Math.random() - 0.5) * 40,
      y: origenY + (Math.random() - 0.5) * 20,
      destinoX: destinoX + (Math.random() - 0.5) * 30,
      destinoY: destinoY + (Math.random() - 0.5) * 30,
      delay: i * 0.04,
    }));
    setParticulas(nuevas);
  };

  const [apps, setApps] = useState(data.appsIniciales);
  const [tarjetas, setTarjetas] = useState(data.tarjetasIniciales);
  const [empleados, setEmpleados] = useState(data.empleadosIniciales);
  const [mensajes, setMensajes] = useState(data.mensajesIniciales);
  const [mostrarFormApp, setMostrarFormApp] = useState(false);
  const [mostrarFormTarjeta, setMostrarFormTarjeta] = useState(false);
  const [mostrarFormEmpleado, setMostrarFormEmpleado] = useState(false);
  const [mostrarFormMensaje, setMostrarFormMensaje] = useState(false);
  const [cargarSaldoId, setCargarSaldoId] = useState(null);
  const [montoCarga, setMontoCarga] = useState("50000");
  const [nuevaApp, setNuevaApp] = useState({ nombre: "", descripcion: "" });
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    titular: "",
    dni: "",
    cvv: "",
    vencimiento: "",
    tipo: "Débito",
    moneda: "ARS",
  });
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    rol: "Tester",
    limite: 500,
  });
  const [nuevoMensaje, setNuevoMensaje] = useState({
    para: "Todos",
    asunto: "",
    texto: "",
  });

  // Funciones de creación
  const crearApp = () => {
    if (!nuevaApp.nombre.trim()) return;
    const nueva = {
      id: apps.length + 1,
      nombre: nuevaApp.nombre,
      descripcion: nuevaApp.descripcion || "Sin descripción",
      publicKey: "APP_PUBLIC_" + Math.random().toString(36).substr(2, 9),
      secretKey: "APP_SECRET_" + Math.random().toString(36).substr(2, 9),
      fecha: new Date().toISOString().split("T")[0],
    };
    setApps([nueva, ...apps]);
    setNuevaApp({ nombre: "", descripcion: "" });
    setMostrarFormApp(false);
  };

  const crearTarjeta = () => {
    if (!nuevaTarjeta.titular.trim()) return;
    const tipoNumero = nuevaTarjeta.tipo === "Débito" ? "5031" : "4509";
    const nueva = {
      id: tarjetas.length + 1,
      tipo: nuevaTarjeta.tipo,
      moneda: nuevaTarjeta.moneda,
      numero: `${tipoNumero} ${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      titular: nuevaTarjeta.titular,
      vencimiento: nuevaTarjeta.vencimiento || "12/28",
      saldo: nuevaTarjeta.tipo === "Débito" ? 0 : undefined,
      limite: nuevaTarjeta.tipo === "Crédito" ? 100000 : undefined,
      consumido: nuevaTarjeta.tipo === "Crédito" ? 0 : undefined,
      cvv: nuevaTarjeta.cvv || "123",
      estado: "activa",
    };
    setTarjetas([nueva, ...tarjetas]);
    setNuevaTarjeta({
      titular: "",
      dni: "",
      cvv: "",
      vencimiento: "",
      tipo: "Débito",
      moneda: "ARS",
    });
    setMostrarFormTarjeta(false);

    // Efecto visual de partículas hacia la sección de billetera
    const btn = document.querySelector(".sidebar-item-billetera");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      lanzarParticulas(
        window.innerWidth / 2,
        window.innerHeight / 2,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
    }
  };

  const cargarSaldo = (id) => {
    const monto = parseInt(montoCarga) || 0;
    if (monto <= 0) return;
    setTarjetas(
      tarjetas.map((t) => {
        if (t.id === id && t.tipo === "Débito")
          return { ...t, saldo: t.saldo + monto };
        return t;
      }),
    );
    setCargarSaldoId(null);
    setMontoCarga("50000");

    // Efecto visual de partículas hacia la sección de billetera
    const btn = document.querySelector(".sidebar-item-billetera");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      lanzarParticulas(
        window.innerWidth / 2,
        window.innerHeight / 2,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
    }
  };

  const crearEmpleado = () => {
    if (!nuevoEmpleado.nombre.trim()) return;
    const nuevo = {
      id: empleados.length + 1,
      nombre: nuevoEmpleado.nombre,
      rol: nuevoEmpleado.rol,
      limiteTokens: nuevoEmpleado.limite,
      tokensUsados: 0,
      avatar: nuevoEmpleado.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
    };
    setEmpleados([nuevo, ...empleados]);
    setNuevoEmpleado({ nombre: "", rol: "Tester", limite: 500 });
    setMostrarFormEmpleado(false);
  };

  const enviarMensaje = () => {
    if (!nuevoMensaje.asunto.trim() || !nuevoMensaje.texto.trim()) return;
    const nuevo = {
      id: mensajes.length + 1,
      de: "Yo",
      para: nuevoMensaje.para,
      asunto: nuevoMensaje.asunto,
      mensaje: nuevoMensaje.texto,
      fecha: new Date().toISOString().split("T")[0],
      leido: true,
    };
    setMensajes([nuevo, ...mensajes]);
    setNuevoMensaje({ para: "Todos", asunto: "", texto: "" });
    setMostrarFormMensaje(false);
  };

  const menuItems = [
    { id: "dashboard", label: data.menuDashboard, icon: FaHome },
    { id: "crearApp", label: data.menuCrearApp, icon: FaRocket },
    { id: "tarjetas", label: data.menuMisTarjetas, icon: FaCreditCard },
    { id: "billetera", label: data.menuBilletera, icon: FaWallet },
    { id: "empleados", label: data.menuEmpleados, icon: FaUsers },
    { id: "mensajes", label: data.menuMensajes, icon: FaEnvelope },
  ];

  const renderSeccion = () => {
    switch (seccion) {
      case "dashboard":
        return (
          <Dashboard
            estilos={estilos}
            data={data}
            apps={apps}
            tarjetas={tarjetas}
            empleados={empleados}
          />
        );
      case "crearApp":
        return (
          <CrearApp
            estilos={estilos}
            data={data}
            apps={apps}
            nuevaApp={nuevaApp}
            setNuevaApp={setNuevaApp}
            mostrarFormApp={mostrarFormApp}
            setMostrarFormApp={setMostrarFormApp}
            crearApp={crearApp}
          />
        );
      case "tarjetas":
        return (
          <Tarjetas
            estilos={estilos}
            data={data}
            tarjetas={tarjetas}
            nuevaTarjeta={nuevaTarjeta}
            setNuevaTarjeta={setNuevaTarjeta}
            mostrarFormTarjeta={mostrarFormTarjeta}
            setMostrarFormTarjeta={setMostrarFormTarjeta}
            crearTarjeta={crearTarjeta}
            cargarSaldoId={cargarSaldoId}
            setCargarSaldoId={setCargarSaldoId}
            montoCarga={montoCarga}
            setMontoCarga={setMontoCarga}
            cargarSaldo={cargarSaldo}
            tarjetaHover={tarjetaHover}
            setTarjetaHover={setTarjetaHover}
          />
        );
      case "billetera":
        return <Billetera estilos={estilos} data={data} tarjetas={tarjetas} />;
      case "empleados":
        return (
          <Empleados
            estilos={estilos}
            data={data}
            empleados={empleados}
            nuevoEmpleado={nuevoEmpleado}
            setNuevoEmpleado={setNuevoEmpleado}
            mostrarFormEmpleado={mostrarFormEmpleado}
            setMostrarFormEmpleado={setMostrarFormEmpleado}
            crearEmpleado={crearEmpleado}
          />
        );
      case "mensajes":
        return (
          <Mensajes
            estilos={estilos}
            data={data}
            mensajes={mensajes}
            nuevoMensaje={nuevoMensaje}
            setNuevoMensaje={setNuevoMensaje}
            mostrarFormMensaje={mostrarFormMensaje}
            setMostrarFormMensaje={setMostrarFormMensaje}
            enviarMensaje={enviarMensaje}
          />
        );
      default:
        return (
          <Dashboard
            estilos={estilos}
            data={data}
            apps={apps}
            tarjetas={tarjetas}
            empleados={empleados}
          />
        );
    }
  };

  return (
    <div
      style={{
        display: estilos.contenedorDisplay,
        height: estilos.contenedorHeight,
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: estilos.sidebarWidth,
          background: estilos.sidebarBackground,
          padding: estilos.sidebarPadding,
          borderRight: estilos.sidebarBorderRight,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: estilos.sidebarLogoFontSize,
            fontWeight: estilos.sidebarLogoFontWeight,
            color: estilos.sidebarLogoColor,
            marginBottom: estilos.sidebarLogoMarginBottom,
            paddingLeft: estilos.sidebarLogoPaddingLeft,
          }}
        >
          PaySim
        </div>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className={item.id === "billetera" ? "sidebar-item-billetera" : ""}
            style={{
              padding: estilos.sidebarItemPadding,
              fontSize: estilos.sidebarItemFontSize,
              color:
                seccion === item.id
                  ? estilos.sidebarItemColorActivo
                  : estilos.sidebarItemColor,
              background:
                seccion === item.id
                  ? estilos.sidebarItemBackgroundActivo
                  : "transparent",
              borderLeft:
                seccion === item.id
                  ? estilos.sidebarItemBorderLeftActivo
                  : estilos.sidebarItemBorderLeft,
              display: "flex",
              alignItems: "center",
              gap: estilos.sidebarItemGap,
              cursor: estilos.sidebarItemCursor,
              transition: estilos.sidebarItemTransition,
            }}
          >
            <item.icon style={{ fontSize: estilos.sidebarIconSize }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div
        style={{
          flex: estilos.mainFlex,
          padding: estilos.mainPadding,
          overflowY: estilos.mainOverflowY,
          background: "#0f0f1a",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={seccion}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {renderSeccion()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Partículas de tokens */}
      {particulas.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
          animate={{ opacity: 0, scale: 0, x: p.destinoX, y: p.destinoY }}
          transition={{ duration: 0.9, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "fixed",
            width: estilos.particulaSize,
            height: estilos.particulaSize,
            borderRadius: "50%",
            background: estilos.particulaColor,
            boxShadow: `0 0 6px ${estilos.particulaColor}, 0 0 12px ${estilos.particulaColor}`,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

/* ================================================================
   DASHBOARD
   ================================================================ */
const Dashboard = ({ estilos, data, apps, tarjetas, empleados }) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: estilos.headerMarginBottom,
      }}
    >
      <h2
        style={{
          fontSize: estilos.headerTitleFontSize,
          fontWeight: estilos.headerTitleFontWeight,
          color: estilos.headerTitleColor,
          margin: 0,
        }}
      >
        {data.menuDashboard}
      </h2>
      <span
        style={{
          background: estilos.headerBadgeBackground,
          color: estilos.headerBadgeColor,
          padding: estilos.headerBadgePadding,
          borderRadius: estilos.headerBadgeBorderRadius,
          fontSize: estilos.headerBadgeFontSize,
          fontWeight: estilos.headerBadgeFontWeight,
        }}
      >
        {data.planActual}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
      }}
    >
      <StatCard
        estilos={estilos}
        icon={FaWallet}
        valor={data.saldoTokens}
        label={data.labelTokens + " " + data.labelDisponible}
        color={estilos.botonPrimarioBackground}
      />
      <StatCard
        estilos={estilos}
        icon={FaCoins}
        valor={data.tokensConsumidos}
        label={data.labelTokens + " " + data.labelConsumidos}
        color="#FF6B00"
      />
      <StatCard
        estilos={estilos}
        icon={FaRocket}
        valor={apps.length}
        label="Aplicaciones"
        color="#00A650"
      />
      <StatCard
        estilos={estilos}
        icon={FaUsers}
        valor={empleados.length}
        label="Empleados"
        color="#3483FA"
      />
    </div>
    <h3
      style={{
        color: "rgba(255,255,255,0.6)",
        fontSize: "0.9rem",
        marginBottom: "0.5rem",
      }}
    >
      Aplicaciones recientes
    </h3>
    {apps.slice(0, 3).map((app) => (
      <div
        key={app.id}
        style={{
          background: estilos.statCardBackground,
          padding: "0.6rem 1rem",
          borderRadius: "8px",
          marginBottom: "0.4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
            {app.nombre}
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            {app.fecha}
          </div>
        </div>
        <span
          style={{
            background: estilos.badgeBackground,
            color: estilos.badgeColor,
            padding: estilos.badgePadding,
            borderRadius: estilos.badgeBorderRadius,
            fontSize: estilos.badgeFontSize,
          }}
        >
          {app.publicKey.slice(0, 20)}...
        </span>
      </div>
    ))}
  </div>
);

const StatCard = ({ estilos, icon: Icon, valor, label, color }) => (
  <div
    style={{
      background: estilos.statCardBackground,
      borderRadius: estilos.statCardBorderRadius,
      padding: estilos.statCardPadding,
      border: estilos.statCardBorder,
      flex: estilos.statCardFlex,
      minWidth: estilos.statCardMinWidth,
    }}
  >
    <Icon
      style={{
        fontSize: estilos.statCardIconSize,
        color: color,
        marginBottom: "0.5rem",
      }}
    />
    <div
      style={{
        fontSize: estilos.statCardValorFontSize,
        fontWeight: estilos.statCardValorFontWeight,
        color: estilos.statCardValorColor,
      }}
    >
      {valor}
    </div>
    <div
      style={{
        fontSize: estilos.statCardLabelFontSize,
        color: estilos.statCardLabelColor,
      }}
    >
      {label}
    </div>
  </div>
);

/* ================================================================
   CREAR APP
   ================================================================ */
const CrearApp = ({
  estilos,
  data,
  apps,
  nuevaApp,
  setNuevaApp,
  mostrarFormApp,
  setMostrarFormApp,
  crearApp,
}) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: estilos.headerMarginBottom,
      }}
    >
      <h2
        style={{
          fontSize: estilos.headerTitleFontSize,
          fontWeight: estilos.headerTitleFontWeight,
          color: estilos.headerTitleColor,
          margin: 0,
        }}
      >
        {data.menuCrearApp}
      </h2>
      <button
        onClick={() => setMostrarFormApp(!mostrarFormApp)}
        style={{
          background: estilos.botonPrimarioBackground,
          color: estilos.botonPrimarioColor,
          padding: estilos.botonPrimarioPadding,
          borderRadius: estilos.botonPrimarioBorderRadius,
          border: estilos.botonPrimarioBorder,
          fontSize: estilos.botonPrimarioFontSize,
          fontWeight: estilos.botonPrimarioFontWeight,
          cursor: estilos.botonPrimarioCursor,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <FaPlus /> {data.crearAppTitulo}
      </button>
    </div>
    {mostrarFormApp && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        style={{
          background: estilos.statCardBackground,
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            flexWrap: "wrap",
            marginBottom: "0.8rem",
          }}
        >
          <input
            placeholder={data.crearAppNombre}
            value={nuevaApp.nombre}
            onChange={(e) =>
              setNuevaApp({ ...nuevaApp, nombre: e.target.value })
            }
            style={{
              flex: 2,
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
          <input
            placeholder={data.crearAppDescripcion}
            value={nuevaApp.descripcion}
            onChange={(e) =>
              setNuevaApp({ ...nuevaApp, descripcion: e.target.value })
            }
            style={{
              flex: 3,
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
        </div>
        <button
          onClick={crearApp}
          style={{
            background: estilos.botonExitoBackground,
            color: estilos.botonExitoColor,
            border: estilos.botonExitoBorder,
            padding: estilos.botonPrimarioPadding,
            borderRadius: estilos.botonPrimarioBorderRadius,
            fontSize: estilos.botonPrimarioFontSize,
            fontWeight: estilos.botonPrimarioFontWeight,
            cursor: estilos.botonPrimarioCursor,
          }}
        >
          <FaRocket style={{ marginRight: "0.4rem" }} />
          {data.crearAppBoton} ({data.crearAppCosto})
        </button>
      </motion.div>
    )}
    <div style={{ display: "grid", gap: estilos.appsGridGap }}>
      {apps.map((app) => (
        <div
          key={app.id}
          style={{
            background: estilos.statCardBackground,
            borderRadius: "10px",
            padding: "0.8rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {app.nombre}
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
            >
              {app.descripcion} · {app.fecha}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div
              style={{
                background: estilos.credencialesBackground,
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontFamily: "monospace",
                color: "#00ff88",
              }}
            >
              PK: {app.publicKey.slice(0, 16)}...
            </div>
            <div
              style={{
                background: estilos.credencialesBackground,
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontFamily: "monospace",
                color: "#00ff88",
              }}
            >
              SK: {app.secretKey.slice(0, 16)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ================================================================
   TARJETAS
   ================================================================ */
const Tarjetas = ({
  estilos,
  data,
  tarjetas,
  nuevaTarjeta,
  setNuevaTarjeta,
  mostrarFormTarjeta,
  setMostrarFormTarjeta,
  crearTarjeta,
  cargarSaldoId,
  setCargarSaldoId,
  montoCarga,
  setMontoCarga,
  cargarSaldo,
  tarjetaHover,
  setTarjetaHover,
}) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: estilos.headerMarginBottom,
      }}
    >
      <h2
        style={{
          fontSize: estilos.headerTitleFontSize,
          fontWeight: estilos.headerTitleFontWeight,
          color: estilos.headerTitleColor,
          margin: 0,
        }}
      >
        {data.menuMisTarjetas}
      </h2>
      <button
        onClick={() => setMostrarFormTarjeta(!mostrarFormTarjeta)}
        style={{
          background: estilos.botonPrimarioBackground,
          color: estilos.botonPrimarioColor,
          padding: estilos.botonPrimarioPadding,
          borderRadius: estilos.botonPrimarioBorderRadius,
          border: estilos.botonPrimarioBorder,
          fontSize: estilos.botonPrimarioFontSize,
          fontWeight: estilos.botonPrimarioFontWeight,
          cursor: estilos.botonPrimarioCursor,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <FaPlus /> {data.crearTarjetaTitulo}
      </button>
    </div>
    {mostrarFormTarjeta && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        style={{
          background: estilos.statCardBackground,
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.8rem",
            marginBottom: "0.8rem",
          }}
        >
          <input
            placeholder="Titular"
            value={nuevaTarjeta.titular}
            onChange={(e) =>
              setNuevaTarjeta({ ...nuevaTarjeta, titular: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
          <input
            placeholder="DNI"
            value={nuevaTarjeta.dni}
            onChange={(e) =>
              setNuevaTarjeta({ ...nuevaTarjeta, dni: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
          <input
            placeholder="CVV"
            value={nuevaTarjeta.cvv}
            onChange={(e) =>
              setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
          <input
            placeholder="Vencimiento (MM/AA)"
            value={nuevaTarjeta.vencimiento}
            onChange={(e) =>
              setNuevaTarjeta({ ...nuevaTarjeta, vencimiento: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
          <select
            value={nuevaTarjeta.tipo}
            onChange={(e) =>
              setNuevaTarjeta({ ...nuevaTarjeta, tipo: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          >
            <option value="Débito">Débito</option>
            <option value="Crédito">Crédito</option>
          </select>
          <select
            value={nuevaTarjeta.moneda}
            onChange={(e) =>
              setNuevaTarjeta({ ...nuevaTarjeta, moneda: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <button
          onClick={crearTarjeta}
          style={{
            background: estilos.botonExitoBackground,
            color: estilos.botonExitoColor,
            border: estilos.botonExitoBorder,
            padding: estilos.botonPrimarioPadding,
            borderRadius: estilos.botonPrimarioBorderRadius,
            fontSize: estilos.botonPrimarioFontSize,
            fontWeight: estilos.botonPrimarioFontWeight,
            cursor: estilos.botonPrimarioCursor,
          }}
        >
          <FaCreditCard style={{ marginRight: "0.4rem" }} />
          {data.crearTarjetaBoton} ({data.crearTarjetaCosto})
        </button>
      </motion.div>
    )}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: estilos.tarjetasGridGap,
      }}
    >
      {tarjetas.map((tarjeta) => (
        <div
          key={tarjeta.id}
          onMouseEnter={() => setTarjetaHover(tarjeta.id)}
          onMouseLeave={() => setTarjetaHover(null)}
          style={{
            background: "linear-gradient(135deg, #1a1a2e, #0d1b2a)",
            borderRadius: estilos.tarjetaBorderRadius,
            padding: estilos.tarjetaPadding,
            color: estilos.tarjetaColor,
            position: "relative",
            transform:
              tarjetaHover === tarjeta.id
                ? "perspective(600px) rotateY(8deg) scale(1.02)"
                : "perspective(600px) rotateY(0deg) scale(1)",
            boxShadow:
              tarjetaHover === tarjeta.id
                ? "0 20px 40px rgba(0,158,227,0.3), 0 0 20px rgba(0,158,227,0.15)"
                : "0 4px 12px rgba(0,0,0,0.3)",
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.8rem",
            }}
          >
            <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
              {tarjeta.tipo} {tarjeta.moneda}
            </span>
            <FaCreditCard style={{ fontSize: "1.5rem", opacity: 0.8 }} />
          </div>
          <div
            style={{
              fontSize: estilos.tarjetaNumeroSize,
              letterSpacing: estilos.tarjetaNumeroSpacing,
              marginBottom: "0.6rem",
              fontFamily: "'Courier New', monospace",
            }}
          >
            {tarjeta.numero}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: estilos.tarjetaTitularSize,
              opacity: 0.8,
              marginBottom: "0.3rem",
            }}
          >
            <span>{tarjeta.titular}</span>
            <span>{tarjeta.vencimiento}</span>
          </div>
          <div
            style={{
              marginTop: "0.8rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {tarjeta.tipo === "Débito" ? (
                <div
                  style={{
                    fontSize: estilos.tarjetaSaldoSize,
                    fontWeight: "bold",
                  }}
                >
                  ARS $ {tarjeta.saldo.toLocaleString("es-AR")}
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    Límite: $ {tarjeta.limite.toLocaleString("es-AR")}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#FF6B00" }}>
                    Consumido: $ {tarjeta.consumido.toLocaleString("es-AR")}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={() => setCargarSaldoId(tarjeta.id)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <FaCoins style={{ marginRight: "0.2rem" }} />
                {data.botonRecargar}
              </button>
            </div>
          </div>
          {cargarSaldoId === tarjeta.id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "0.6rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <input
                type="number"
                value={montoCarga}
                onChange={(e) => setMontoCarga(e.target.value)}
                style={{
                  flex: 1,
                  background: estilos.inputBackground,
                  border: estilos.inputBorder,
                  borderRadius: estilos.inputBorderRadius,
                  padding: "0.4rem 0.6rem",
                  fontSize: "0.8rem",
                  color: estilos.inputColor,
                  outline: estilos.inputOutline,
                }}
              />
              <button
                onClick={() => cargarSaldo(tarjeta.id)}
                style={{
                  background: estilos.botonExitoBackground,
                  color: estilos.botonExitoColor,
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                <FaCheckCircle /> {data.cargarSaldoBoton}
              </button>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ================================================================
   BILLETERA
   ================================================================ */
const Billetera = ({ estilos, data, tarjetas }) => {
  const totalSaldo = tarjetas
    .filter((t) => t.tipo === "Débito")
    .reduce((acc, t) => acc + t.saldo, 0);
  const totalLimite = tarjetas
    .filter((t) => t.tipo === "Crédito")
    .reduce((acc, t) => acc + t.limite, 0);
  const totalConsumido = tarjetas
    .filter((t) => t.tipo === "Crédito")
    .reduce((acc, t) => acc + t.consumido, 0);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: estilos.headerMarginBottom,
        }}
      >
        <h2
          style={{
            fontSize: estilos.headerTitleFontSize,
            fontWeight: estilos.headerTitleFontWeight,
            color: estilos.headerTitleColor,
            margin: 0,
          }}
        >
          {data.menuBilletera}
        </h2>
        <span
          style={{
            background: estilos.headerBadgeBackground,
            color: estilos.headerBadgeColor,
            padding: estilos.headerBadgePadding,
            borderRadius: estilos.headerBadgeBorderRadius,
            fontSize: estilos.headerBadgeFontSize,
            fontWeight: estilos.headerBadgeFontWeight,
          }}
        >
          {data.saldoTokens} {data.labelTokens} {data.labelDisponible}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard
          estilos={estilos}
          icon={FaWallet}
          valor={data.saldoTokens}
          label={data.labelTokens + " " + data.labelDisponible}
          color={estilos.botonPrimarioBackground}
        />
        <StatCard
          estilos={estilos}
          icon={FaCoins}
          valor={`ARS $ ${totalSaldo.toLocaleString("es-AR")}`}
          label="Saldo en débito"
          color="#00A650"
        />
        <StatCard
          estilos={estilos}
          icon={FaCreditCard}
          valor={`ARS $ ${totalLimite.toLocaleString("es-AR")}`}
          label="Límite total crédito"
          color="#FF6B00"
        />
        <StatCard
          estilos={estilos}
          icon={FaArrowRight}
          valor={`ARS $ ${totalConsumido.toLocaleString("es-AR")}`}
          label="Consumido crédito"
          color="#F23D4F"
        />
      </div>
      <h3
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "0.9rem",
          marginBottom: "0.5rem",
        }}
      >
        Equivalencia
      </h3>
      <div
        style={{
          background: estilos.statCardBackground,
          borderRadius: "10px",
          padding: "0.8rem 1rem",
          fontSize: "0.85rem",
        }}
      >
        1 token = AR$ 5.000 · Cargar $50.000 equivale a 10 tokens
      </div>
    </div>
  );
};

/* ================================================================
   EMPLEADOS
   ================================================================ */
const Empleados = ({
  estilos,
  data,
  empleados,
  nuevoEmpleado,
  setNuevoEmpleado,
  mostrarFormEmpleado,
  setMostrarFormEmpleado,
  crearEmpleado,
}) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: estilos.headerMarginBottom,
      }}
    >
      <h2
        style={{
          fontSize: estilos.headerTitleFontSize,
          fontWeight: estilos.headerTitleFontWeight,
          color: estilos.headerTitleColor,
          margin: 0,
        }}
      >
        {data.menuEmpleados}
      </h2>
      <button
        onClick={() => setMostrarFormEmpleado(!mostrarFormEmpleado)}
        style={{
          background: estilos.botonPrimarioBackground,
          color: estilos.botonPrimarioColor,
          padding: estilos.botonPrimarioPadding,
          borderRadius: estilos.botonPrimarioBorderRadius,
          border: estilos.botonPrimarioBorder,
          fontSize: estilos.botonPrimarioFontSize,
          fontWeight: estilos.botonPrimarioFontWeight,
          cursor: estilos.botonPrimarioCursor,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <FaUserPlus /> {data.crearEmpleadoTitulo}
      </button>
    </div>
    {mostrarFormEmpleado && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        style={{
          background: estilos.statCardBackground,
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.8rem",
            marginBottom: "0.8rem",
          }}
        >
          <input
            placeholder={data.crearEmpleadoNombre}
            value={nuevoEmpleado.nombre}
            onChange={(e) =>
              setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
          <select
            value={nuevoEmpleado.rol}
            onChange={(e) =>
              setNuevoEmpleado({ ...nuevoEmpleado, rol: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          >
            <option value="Tester">Tester</option>
            <option value="Developer">Developer</option>
            <option value="Supervisor">Supervisor</option>
          </select>
          <input
            type="number"
            placeholder={data.crearEmpleadoLimite}
            value={nuevoEmpleado.limite}
            onChange={(e) =>
              setNuevoEmpleado({
                ...nuevoEmpleado,
                limite: parseInt(e.target.value) || 0,
              })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
        </div>
        <button
          onClick={crearEmpleado}
          style={{
            background: estilos.botonExitoBackground,
            color: estilos.botonExitoColor,
            border: estilos.botonExitoBorder,
            padding: estilos.botonPrimarioPadding,
            borderRadius: estilos.botonPrimarioBorderRadius,
            fontSize: estilos.botonPrimarioFontSize,
            fontWeight: estilos.botonPrimarioFontWeight,
            cursor: estilos.botonPrimarioCursor,
          }}
        >
          <FaUserPlus style={{ marginRight: "0.4rem" }} />
          {data.crearEmpleadoBoton}
        </button>
      </motion.div>
    )}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: estilos.empleadosGridGap,
      }}
    >
      {empleados.map((emp) => {
        const pct = Math.round((emp.tokensUsados / emp.limiteTokens) * 100);
        return (
          <div
            key={emp.id}
            style={{
              background: estilos.statCardBackground,
              borderRadius: "10px",
              padding: "0.8rem 1rem",
              display: "flex",
              gap: "0.8rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: estilos.botonPrimarioBackground,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.9rem",
                flexShrink: 0,
              }}
            >
              {emp.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {emp.nombre}
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
              >
                {emp.rol} · Límite: {emp.limiteTokens} tokens
              </div>
              <div
                style={{
                  marginTop: "0.3rem",
                  height: "4px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background:
                      pct > 80 ? "#F23D4F" : estilos.botonPrimarioBackground,
                    borderRadius: "2px",
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "0.2rem",
                }}
              >
                {emp.tokensUsados} / {emp.limiteTokens} tokens usados
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ================================================================
   MENSAJES
   ================================================================ */
const Mensajes = ({
  estilos,
  data,
  mensajes,
  nuevoMensaje,
  setNuevoMensaje,
  mostrarFormMensaje,
  setMostrarFormMensaje,
  enviarMensaje,
}) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: estilos.headerMarginBottom,
      }}
    >
      <h2
        style={{
          fontSize: estilos.headerTitleFontSize,
          fontWeight: estilos.headerTitleFontWeight,
          color: estilos.headerTitleColor,
          margin: 0,
        }}
      >
        {data.menuMensajes}
      </h2>
      <button
        onClick={() => setMostrarFormMensaje(!mostrarFormMensaje)}
        style={{
          background: estilos.botonPrimarioBackground,
          color: estilos.botonPrimarioColor,
          padding: estilos.botonPrimarioPadding,
          borderRadius: estilos.botonPrimarioBorderRadius,
          border: estilos.botonPrimarioBorder,
          fontSize: estilos.botonPrimarioFontSize,
          fontWeight: estilos.botonPrimarioFontWeight,
          cursor: estilos.botonPrimarioCursor,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <FaPaperPlane /> {data.enviarMensajeTitulo}
      </button>
    </div>
    {mostrarFormMensaje && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        style={{
          background: estilos.statCardBackground,
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            marginBottom: "0.8rem",
            flexWrap: "wrap",
          }}
        >
          <select
            value={nuevoMensaje.para}
            onChange={(e) =>
              setNuevoMensaje({ ...nuevoMensaje, para: e.target.value })
            }
            style={{
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          >
            <option value="Todos">Todos</option>
            <option value="María García">María García</option>
            <option value="Carlos López">Carlos López</option>
            <option value="Ana Martínez">Ana Martínez</option>
            <option value="Pedro Ramírez">Pedro Ramírez</option>
            <option value="Jorge Díaz">Jorge Díaz</option>
          </select>
          <input
            placeholder={data.enviarMensajeAsunto}
            value={nuevoMensaje.asunto}
            onChange={(e) =>
              setNuevoMensaje({ ...nuevoMensaje, asunto: e.target.value })
            }
            style={{
              flex: 1,
              minWidth: "200px",
              background: estilos.inputBackground,
              border: estilos.inputBorder,
              borderRadius: estilos.inputBorderRadius,
              padding: estilos.inputPadding,
              fontSize: estilos.inputFontSize,
              color: estilos.inputColor,
              outline: estilos.inputOutline,
            }}
          />
        </div>
        <textarea
          placeholder={data.enviarMensajeTexto}
          value={nuevoMensaje.texto}
          onChange={(e) =>
            setNuevoMensaje({ ...nuevoMensaje, texto: e.target.value })
          }
          rows={2}
          style={{
            width: "100%",
            background: estilos.inputBackground,
            border: estilos.inputBorder,
            borderRadius: estilos.inputBorderRadius,
            padding: estilos.inputPadding,
            fontSize: estilos.inputFontSize,
            color: estilos.inputColor,
            outline: estilos.inputOutline,
            resize: "vertical",
            marginBottom: "0.8rem",
          }}
        />
        <button
          onClick={enviarMensaje}
          style={{
            background: estilos.botonPrimarioBackground,
            color: estilos.botonPrimarioColor,
            border: estilos.botonPrimarioBorder,
            padding: estilos.botonPrimarioPadding,
            borderRadius: estilos.botonPrimarioBorderRadius,
            fontSize: estilos.botonPrimarioFontSize,
            fontWeight: estilos.botonPrimarioFontWeight,
            cursor: estilos.botonPrimarioCursor,
          }}
        >
          <FaPaperPlane style={{ marginRight: "0.4rem" }} />
          {data.enviarMensajeBoton}
        </button>
      </motion.div>
    )}
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {mensajes.map((msg) => (
        <div
          key={msg.id}
          style={{
            background: estilos.mensajeBackground,
            borderRadius: estilos.mensajeBorderRadius,
            padding: estilos.mensajePadding,
            border: estilos.mensajeBorder,
            borderLeft: msg.leido
              ? estilos.mensajeBorder
              : estilos.mensajeNoLeidoBorderLeft,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.3rem",
            }}
          >
            <div
              style={{
                fontWeight: estilos.mensajeAsuntoFontSize,
                fontSize: estilos.mensajeAsuntoFontSize,
              }}
            >
              {msg.asunto}
            </div>
            <div
              style={{
                fontSize: estilos.mensajeFechaFontSize,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {msg.fecha}
            </div>
          </div>
          <div
            style={{
              fontSize: estilos.mensajeTextoFontSize,
              color: estilos.mensajeTextoColor,
              marginBottom: "0.3rem",
            }}
          >
            {msg.mensaje}
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              fontSize: estilos.mensajeFechaFontSize,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span>{msg.de}</span>
            <span>→</span>
            <span>{msg.para}</span>
            {!msg.leido && (
              <span
                style={{
                  background: estilos.badgeBackground,
                  color: estilos.badgeColor,
                  padding: "0 0.4rem",
                  borderRadius: estilos.badgeBorderRadius,
                  fontSize: "0.65rem",
                  marginLeft: "auto",
                }}
              >
                Nuevo
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DemoPanel;
