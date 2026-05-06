// frontend/src/pages/admin/modulos/Usuarios.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaUsers,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../../../config/cerebroFront";

const Usuarios = () => {
  const tema = getTemaActivo();
  const textos = cerebroFront.textos.panelAdmin?.usuarios || {};
  const backendUrl = cerebroFront.getBackendUrl();
  const token = localStorage.getItem("token");

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMITE = 50;

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroPlan, setFiltroPlan] = useState("todos");
  const [filtroTipoCuenta, setFiltroTipoCuenta] = useState("todos");

  const cargarUsuarios = useCallback(
    async (nuevoOffset = 0) => {
      setCargando(true);
      try {
        const params = new URLSearchParams({
          limit: LIMITE,
          offset: nuevoOffset,
        });
        if (busqueda) params.append("busqueda", busqueda);
        if (filtroEstado !== "todos") params.append("estado", filtroEstado);
        if (filtroPlan !== "todos") params.append("plan", filtroPlan);
        if (filtroTipoCuenta !== "todos")
          params.append("tipo_cuenta", filtroTipoCuenta);

        const resp = await fetch(
          `${backendUrl}/api/admin/usuarios?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!resp.ok) throw new Error("Error al cargar");
        const data = await resp.json();
        if (nuevoOffset === 0) setUsuarios(data);
        else setUsuarios((prev) => [...prev, ...data]);
        setOffset(nuevoOffset);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    },
    [busqueda, filtroEstado, filtroPlan, filtroTipoCuenta, backendUrl, token],
  );

  useEffect(() => {
    setOffset(0);
    cargarUsuarios(0);
  }, [busqueda, filtroEstado, filtroPlan, filtroTipoCuenta, cargarUsuarios]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: "1200px", margin: "0 auto", color: tema.texto }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        {textos.titulo || "Usuarios"}
      </h2>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: tema.fondo,
          paddingBottom: "1rem",
          marginBottom: "1.5rem",
          borderBottom: `1px solid ${tema.bordeSuave}`,
        }}
      >
        <div
          style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <FaSearch
              style={{
                position: "absolute",
                left: "1rem",
                top: "0.75rem",
                color: tema.texto + "60",
              }}
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={
                textos.placeholderBuscar ||
                "Buscar por nombre, usuario o DNI..."
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                borderRadius: "10px",
                border: `1px solid ${tema.bordeSuave}`,
                backgroundColor: tema.fondoAlt,
                color: tema.texto,
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              padding: "0.5rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${tema.bordeSuave}`,
              backgroundColor: tema.fondoAlt,
              color: tema.texto,
              cursor: "pointer",
            }}
          >
            <option value="todos">
              {textos.filtroTodos || "Todos los estados"}
            </option>
            <option value="activado">{textos.activados || "Activados"}</option>
            <option value="pendiente">
              {textos.pendientes || "Pendientes"}
            </option>
            <option value="bloqueado">
              {textos.bloqueados || "Bloqueados"}
            </option>
            <option value="deuda">{textos.enDeuda || "En deuda"}</option>
          </select>
          <select
            value={filtroPlan}
            onChange={(e) => setFiltroPlan(e.target.value)}
            style={{
              padding: "0.5rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${tema.bordeSuave}`,
              backgroundColor: tema.fondoAlt,
              color: tema.texto,
              cursor: "pointer",
            }}
          >
            <option value="todos">
              {textos.filtroTodosPlanes || "Todos los planes"}
            </option>
            <option value="Free">Free</option>
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
            <option value="PayAsYouGo">PayAsYouGo</option>
          </select>
          <select
            value={filtroTipoCuenta}
            onChange={(e) => setFiltroTipoCuenta(e.target.value)}
            style={{
              padding: "0.5rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${tema.bordeSuave}`,
              backgroundColor: tema.fondoAlt,
              color: tema.texto,
              cursor: "pointer",
            }}
          >
            <option value="todos">
              {textos.filtroTodosTipos || "Todos los tipos"}
            </option>
            <option value="developer">
              {textos.developer || "Developer/Tester"}
            </option>
            <option value="empresa">{textos.empresa || "Empresa"}</option>
          </select>
        </div>
      </div>

      {cargando && usuarios.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <FaSpinner
            style={{
              fontSize: "2rem",
              animation: "spin 1s linear infinite",
              color: tema.primario,
            }}
          />
          <p style={{ marginTop: "1rem", color: tema.texto + "80" }}>
            {textos.cargando || "Cargando usuarios..."}
          </p>
        </div>
      ) : usuarios.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: tema.texto + "60",
          }}
        >
          <FaUsers style={{ fontSize: "3rem", marginBottom: "1rem" }} />
          <p>{textos.sinResultados || "No se encontraron usuarios."}</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {usuarios.map((usuario) => (
              <UsuarioCard
                key={usuario.id}
                usuario={usuario}
                tema={tema}
                textos={textos}
                token={token}
                backendUrl={backendUrl}
                onAccion={() => cargarUsuarios(0)}
              />
            ))}
          </div>
          {usuarios.length >= LIMITE && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button
                onClick={() => cargarUsuarios(offset + LIMITE)}
                disabled={cargando}
                style={{
                  padding: "0.8rem 2rem",
                  borderRadius: "10px",
                  border: `1px solid ${tema.primario}`,
                  backgroundColor: "transparent",
                  color: tema.primario,
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {cargando ? "Cargando..." : textos.mostrarMas || "Mostrar más"}
              </button>
            </div>
          )}
        </>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

const UsuarioCard = ({
  usuario,
  tema,
  textos,
  token,
  backendUrl,
  onAccion,
}) => {
  const [modalDetalle, setModalDetalle] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMensaje, setModalMensaje] = useState(null);
  const [modalRegalar, setModalRegalar] = useState(false);
  const [cantidadTokens, setCantidadTokens] = useState("");
  const [passwordRegalo, setPasswordRegalo] = useState("");
  const [modalCambiarPlan, setModalCambiarPlan] = useState(false);
  const [nuevoPlan, setNuevoPlan] = useState("");

  const enDeuda = usuario.en_deuda === true;
  const bloqueado = usuario.activo === false;
  const pendiente = usuario.email_verificado === false;
  const planActual = usuario.plan || "Free";
  const colorFondo = enDeuda
    ? tema.error + "10"
    : bloqueado
      ? tema.advertencia + "10"
      : tema.fondoAlt;
  const bordeColor = enDeuda
    ? tema.error
    : bloqueado
      ? tema.advertencia
      : tema.bordeSuave;

  const abrirDetalle = async () => {
    setModalDetalle(true);
    setCargandoDetalle(true);
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/usuarios/${usuario.id}/detalle`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!resp.ok) throw new Error("Error al cargar detalle");
      const data = await resp.json();
      setDetalle(data);
    } catch {
      setDetalle(null);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const handleBloquear = async () => {
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/usuarios/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bloquear: true }),
        },
      );
      if (!resp.ok) throw new Error("Error");
      onAccion();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDesbloquear = async () => {
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/usuarios/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ desbloquear: true }),
        },
      );
      if (!resp.ok) throw new Error("Error");
      onAccion();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async () => {
    if (!confirmUsername || !confirmPassword) {
      setModalMensaje({ tipo: "error", texto: "Completá todos los campos." });
      return;
    }
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/usuarios/${usuario.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password_admin: confirmPassword,
            username_confirmacion: confirmUsername,
          }),
        },
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error al eliminar");
      setModalEliminar(false);
      setConfirmUsername("");
      setConfirmPassword("");
      onAccion();
    } catch (err) {
      setModalMensaje({ tipo: "error", texto: err.message });
    }
  };

  const handleRegalarTokens = async () => {
    if (!cantidadTokens || !passwordRegalo) {
      setModalMensaje({ tipo: "error", texto: "Completá todos los campos." });
      return;
    }
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/usuarios/${usuario.id}/regalar-tokens`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cantidad: parseInt(cantidadTokens, 10),
            password_admin: passwordRegalo,
          }),
        },
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error al regalar tokens");
      setModalRegalar(false);
      setCantidadTokens("");
      setPasswordRegalo("");
      onAccion();
    } catch (err) {
      setModalMensaje({ tipo: "error", texto: err.message });
    }
  };

  const handleCambiarPlan = async () => {
    if (!nuevoPlan) {
      setModalMensaje({ tipo: "error", texto: "Seleccioná un plan." });
      return;
    }
    try {
      const resp = await fetch(
        `${backendUrl}/api/admin/usuarios/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cambiar_plan: nuevoPlan }),
        },
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error al cambiar plan");
      setModalCambiarPlan(false);
      setNuevoPlan("");
      onAccion();
    } catch (err) {
      setModalMensaje({ tipo: "error", texto: err.message });
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: colorFondo,
          borderRadius: "14px",
          padding: "1.2rem",
          border: `1px solid ${bordeColor}`,
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                margin: "0 0 0.25rem",
              }}
            >
              {usuario.nombre || "Sin nombre"} {usuario.apellido || ""}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: tema.texto + "60",
                margin: 0,
              }}
            >
              @{usuario.username}
            </p>
          </div>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: "600",
              backgroundColor:
                planActual === "Enterprise"
                  ? tema.secundario + "20"
                  : planActual === "Pro"
                    ? tema.info + "20"
                    : planActual === "Starter"
                      ? tema.exito + "20"
                      : tema.texto + "15",
              color:
                planActual === "Enterprise"
                  ? tema.secundario
                  : planActual === "Pro"
                    ? tema.info
                    : planActual === "Starter"
                      ? tema.exito
                      : tema.texto,
            }}
          >
            {planActual}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            fontSize: "0.85rem",
            marginBottom: "0.75rem",
          }}
        >
          <div>
            <span style={{ color: tema.texto + "50" }}>
              {textos.dni || "DNI"}:
            </span>{" "}
            {usuario.dni}
          </div>
          <div>
            <span style={{ color: tema.texto + "50" }}>
              {textos.tipo || "Tipo"}:
            </span>{" "}
            {usuario.tipo_cuenta === "empresa"
              ? textos.empresa || "Empresa"
              : textos.developer || "Developer"}
          </div>
          <div>
            <span style={{ color: tema.texto + "50" }}>
              {textos.tokens || "Tokens"}:
            </span>{" "}
            {usuario.saldo_tokens || 0}
          </div>
          <div>
            <span style={{ color: tema.texto + "50" }}>
              {textos.alta || "Alta"}:
            </span>{" "}
            {formatearFecha(usuario.created_at)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          {enDeuda && (
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                backgroundColor: tema.error + "20",
                color: tema.error,
                fontWeight: "600",
              }}
            >
              {textos.enDeuda || "En deuda"}
            </span>
          )}
          {bloqueado && (
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                backgroundColor: tema.advertencia + "20",
                color: tema.advertencia,
                fontWeight: "600",
              }}
            >
              {textos.bloqueado || "Bloqueado"}
            </span>
          )}
          {pendiente && (
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                backgroundColor: tema.info + "20",
                color: tema.info,
                fontWeight: "600",
              }}
            >
              {textos.pendiente || "Pendiente"}
            </span>
          )}
          {!enDeuda && !bloqueado && !pendiente && (
            <span
              style={{
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.75rem",
                backgroundColor: tema.exito + "20",
                color: tema.exito,
                fontWeight: "600",
              }}
            >
              {textos.cuentaActivada || "Cuenta Activada"}
            </span>
          )}
        </div>

        {/* Botones de acción siempre visibles */}
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            borderTop: `1px solid ${tema.bordeSuave}`,
            paddingTop: "0.75rem",
          }}
        >
          <button
            onClick={handleBloquear}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: `1px solid ${tema.advertencia}`,
              backgroundColor: "transparent",
              color: tema.advertencia,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {textos.bloquear || "Bloquear"}
          </button>
          <button
            onClick={handleDesbloquear}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: `1px solid ${tema.exito}`,
              backgroundColor: "transparent",
              color: tema.exito,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {textos.desbloquear || "Desbloquear"}
          </button>
          <button
            onClick={() => setModalRegalar(true)}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: `1px solid ${tema.info}`,
              backgroundColor: "transparent",
              color: tema.info,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {textos.regalarTokens || "Regalar"}
          </button>
          <button
            onClick={() => setModalCambiarPlan(true)}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: `1px solid ${tema.secundario}`,
              backgroundColor: "transparent",
              color: tema.secundario,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {textos.cambiarPlan || "Plan"}
          </button>
          <button
            onClick={() => setModalEliminar(true)}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: `1px solid ${tema.error}`,
              backgroundColor: "transparent",
              color: tema.error,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {textos.eliminar || "Eliminar"}
          </button>
          <button
            onClick={abrirDetalle}
            style={{
              padding: "0.35rem 0.7rem",
              borderRadius: "6px",
              border: `1px solid ${tema.primario}`,
              backgroundColor: tema.primario + "15",
              color: tema.primario,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            {textos.detalles || "Detalles"}
          </button>
        </div>
      </motion.div>

      {/* MODAL DETALLES */}
      {modalDetalle && (
        <div
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
          onClick={() => {
            setModalDetalle(false);
            setDetalle(null);
          }}
        >
          <div
            style={{
              backgroundColor: tema.fondo,
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "700px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              border: `2px solid ${tema.primario}`,
              boxShadow: `0 0 15px ${tema.primario}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
                {textos.detalleTitulo || "Detalle del usuario"}
              </h3>
              <button
                onClick={() => {
                  setModalDetalle(false);
                  setDetalle(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: tema.texto,
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            {cargandoDetalle ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <FaSpinner
                  style={{
                    fontSize: "1.5rem",
                    animation: "spin 1s linear infinite",
                    color: tema.primario,
                  }}
                />
                <p style={{ marginTop: "1rem", color: tema.texto + "80" }}>
                  Cargando información...
                </p>
              </div>
            ) : detalle ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <div>
                    <strong>{textos.username || "Usuario"}:</strong>{" "}
                    {usuario.username}
                  </div>
                  <div>
                    <strong>{textos.email || "Email"}:</strong>{" "}
                    {usuario.email || "—"}
                  </div>
                  <div>
                    <strong>{textos.dni || "DNI"}:</strong> {usuario.dni}
                  </div>
                  <div>
                    <strong>{textos.tipo || "Tipo"}:</strong>{" "}
                    {usuario.tipo_cuenta === "empresa"
                      ? textos.empresa || "Empresa"
                      : textos.developer || "Developer"}
                  </div>
                  <div>
                    <strong>{textos.plan || "Plan"}:</strong> {planActual}
                  </div>
                  <div>
                    <strong>{textos.tokens || "Tokens"}:</strong>{" "}
                    {usuario.saldo_tokens || 0}
                  </div>
                  <div>
                    <strong>{textos.appsCreadas || "Apps"}:</strong>{" "}
                    {detalle.total_apps || 0}
                  </div>
                  <div>
                    <strong>{textos.tarjetasCreadas || "Tarjetas"}:</strong>{" "}
                    {detalle.total_tarjetas || 0}
                  </div>
                  <div>
                    <strong>{textos.alta || "Alta"}:</strong>{" "}
                    {formatearFecha(usuario.created_at)}
                  </div>
                  <div>
                    <strong>{textos.proximoCobro || "Próximo cobro"}:</strong>{" "}
                    {planActual === "Free"
                      ? textos.noAplica || "N/A"
                      : formatearFecha(detalle.suscripcion_inicio)}
                  </div>
                </div>

                <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {textos.movimientos || "Movimientos"}
                </h4>
                {detalle.transacciones && detalle.transacciones.length > 0 ? (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      marginBottom: "1.5rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      fontSize: "0.85rem",
                    }}
                  >
                    {detalle.transacciones.map((mov, idx) => (
                      <li
                        key={idx}
                        style={{
                          marginBottom: "0.4rem",
                          padding: "0.4rem 0",
                          borderBottom: `1px solid ${tema.bordeSuave}`,
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>{mov.tipo}</span>:{" "}
                        {mov.descripcion || mov.cantidad + " tokens"} (
                        {formatearFecha(mov.created_at)})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{
                      color: tema.texto + "60",
                      fontSize: "0.9rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {textos.sinMovimientos || "Sin movimientos"}
                  </p>
                )}

                <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {textos.resumenesMensuales || "Resúmenes"}
                </h4>
                {detalle.resumenes && detalle.resumenes.length > 0 ? (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      marginBottom: "1rem",
                      maxHeight: "150px",
                      overflowY: "auto",
                      fontSize: "0.85rem",
                    }}
                  >
                    {detalle.resumenes.map((res, idx) => (
                      <li key={idx} style={{ marginBottom: "0.4rem" }}>
                        {new Date(res.periodo).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                        })}
                        : {res.total_tokens_consumidos} tokens consumidos{" "}
                        {res.pagado ? "(Pagado)" : "(Pendiente)"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: tema.texto + "60", fontSize: "0.9rem" }}>
                    {textos.sinResumenes || "Sin resúmenes"}
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: tema.error }}>Error al cargar el detalle.</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modalEliminar && (
        <div
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
          onClick={() => {
            setModalEliminar(false);
            setModalMensaje(null);
          }}
        >
          <div
            style={{
              backgroundColor: tema.fondo,
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "450px",
              width: "90%",
              border: `2px solid ${tema.error}`,
              boxShadow: `0 0 15px ${tema.error}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: tema.error,
                marginBottom: "1rem",
              }}
            >
              {textos.confirmarEliminar || "Confirmar eliminación"}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: tema.texto,
                marginBottom: "0.5rem",
              }}
            >
              {textos.escribaUsername || "Escribí el nombre de usuario"}{" "}
              <strong>{usuario.username}</strong>{" "}
              {textos.paraConfirmar || "para confirmar:"}
            </p>
            <input
              type="text"
              value={confirmUsername}
              onChange={(e) => setConfirmUsername(e.target.value)}
              placeholder={usuario.username}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: `1px solid ${tema.bordeSuave}`,
                backgroundColor: tema.fondoAlt,
                color: tema.texto,
                marginBottom: "0.75rem",
                boxSizing: "border-box",
              }}
            />
            <p
              style={{
                fontSize: "0.9rem",
                color: tema.texto,
                marginBottom: "0.5rem",
              }}
            >
              {textos.ingresePassword ||
                "Ingresá tu contraseña de administrador:"}
            </p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: `1px solid ${tema.bordeSuave}`,
                backgroundColor: tema.fondoAlt,
                color: tema.texto,
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            />
            {modalMensaje && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: tema.error,
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <FaExclamationCircle /> {modalMensaje.texto}
              </p>
            )}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setModalEliminar(false);
                  setConfirmUsername("");
                  setConfirmPassword("");
                  setModalMensaje(null);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${tema.bordeSuave}`,
                  backgroundColor: "transparent",
                  color: tema.texto,
                  cursor: "pointer",
                }}
              >
                {textos.cancelar || "Cancelar"}
              </button>
              <button
                onClick={handleEliminar}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: tema.error,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {textos.confirmarEliminarBtn || "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGALAR TOKENS */}
      {modalRegalar && (
        <div
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
          onClick={() => {
            setModalRegalar(false);
            setModalMensaje(null);
          }}
        >
          <div
            style={{
              backgroundColor: tema.fondo,
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "450px",
              width: "90%",
              border: `2px solid ${tema.info}`,
              boxShadow: `0 0 15px ${tema.info}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: tema.info,
                marginBottom: "1rem",
              }}
            >
              {textos.regalarTokens || "Regalar tokens"}
            </h3>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              {textos.cantidadTokens || "Cantidad"}:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={cantidadTokens}
              onChange={(e) => setCantidadTokens(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: `1px solid ${tema.bordeSuave}`,
                backgroundColor: tema.fondoAlt,
                color: tema.texto,
                marginBottom: "0.5rem",
                boxSizing: "border-box",
              }}
            />
            <p
              style={{
                fontSize: "0.8rem",
                color: tema.info,
                marginBottom: "1rem",
              }}
            >
              {textos.limiteUsuario || "Límite diario por usuario: 100 tokens"}
            </p>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              {textos.passwordAdmin || "Contraseña de admin"}:
            </label>
            <input
              type="password"
              value={passwordRegalo}
              onChange={(e) => setPasswordRegalo(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: `1px solid ${tema.bordeSuave}`,
                backgroundColor: tema.fondoAlt,
                color: tema.texto,
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            />
            {modalMensaje && (
              <p
                style={{
                  color: tema.error,
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <FaExclamationCircle /> {modalMensaje.texto}
              </p>
            )}
            <button
              onClick={handleRegalarTokens}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: tema.info,
                color: "#FFFFFF",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {textos.regalar || "Regalar"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL CAMBIAR PLAN */}
      {modalCambiarPlan && (
        <div
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
          onClick={() => {
            setModalCambiarPlan(false);
            setModalMensaje(null);
          }}
        >
          <div
            style={{
              backgroundColor: tema.fondo,
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "450px",
              width: "90%",
              border: `2px solid ${tema.secundario}`,
              boxShadow: `0 0 15px ${tema.secundario}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: tema.secundario,
                marginBottom: "1rem",
              }}
            >
              {textos.cambiarPlan || "Cambiar plan"}
            </h3>
            <p style={{ marginBottom: "0.5rem" }}>
              {textos.planActual || "Plan actual"}:{" "}
              <strong>{planActual}</strong>
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: tema.advertencia,
                marginBottom: "1rem",
              }}
            >
              {textos.soloUpgrade || "Solo se permite upgrade"}
            </p>
            <select
              value={nuevoPlan}
              onChange={(e) => setNuevoPlan(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: `1px solid ${tema.bordeSuave}`,
                backgroundColor: tema.fondoAlt,
                color: tema.texto,
                marginBottom: "1rem",
              }}
            >
              <option value="">
                {textos.seleccionarPlan || "Seleccionar plan..."}
              </option>
              {planActual === "Free" && (
                <>
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </>
              )}
              {planActual === "Starter" && (
                <>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </>
              )}
              {planActual === "Pro" && (
                <option value="Enterprise">Enterprise</option>
              )}
            </select>
            {modalMensaje && (
              <p
                style={{
                  color: tema.error,
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <FaExclamationCircle /> {modalMensaje.texto}
              </p>
            )}
            <button
              onClick={handleCambiarPlan}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: tema.secundario,
                color: "#FFFFFF",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {textos.cambiar || "Cambiar"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Usuarios;
