// frontend/src/pages/admin/modulos/MiPerfil.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaCalendarAlt,
  FaVenusMars,
  FaHome,
  FaMapMarkerAlt,
  FaCity,
  FaGlobeAmericas,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
} from "react-icons/fa";
import CampoFlotante from "../../../components/CampoFlotante";
import CampoSelect from "../../../components/CampoSelect";
import { cerebroFront, getTemaActivo } from "../../../config/cerebroFront";

const MiPerfil = () => {
  const tema = getTemaActivo();
  // Usa textos del panel si existen, si no, los del registro (evita hardcodeo)
  const textosPanel = cerebroFront.textos.panelAdmin?.perfil || {};
  const textosReg = cerebroFront.textos.registro || {};
  const estilos = cerebroFront.estilos.registroForm;
  const backendUrl = cerebroFront.getBackendUrl();
  const token = localStorage.getItem("token");

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [modal, setModal] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [codPostal, setCodPostal] = useState("");
  const [provincia, setProvincia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [mostrarPassActual, setMostrarPassActual] = useState(false);
  const [mostrarPassNueva, setMostrarPassNueva] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarPerfil = async () => {
    try {
      const resp = await fetch(`${backendUrl}/api/admin/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Error al cargar");
      const data = await resp.json();
      setPerfil(data);
      setNombre(data.nombre || "");
      setApellido(data.apellido || "");
      setEmail(data.email || "");
      setDni(data.dni || "");
      setFechaNacimiento(data.fecha_nacimiento || "");
      setSexo(data.sexo || "");
      setDomicilio(data.domicilio || "");
      setLocalidad(data.localidad || "");
      setCodPostal(data.cod_postal || "");
      setProvincia(data.provincia || "");
      setTelefono(data.telefono || "");
    } catch {
      setModal({
        tipo: "error",
        titulo: "Error",
        mensaje: "No se pudo cargar el perfil.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const guardarPerfil = async () => {
    try {
      const resp = await fetch(`${backendUrl}/api/admin/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          dni,
          fecha_nacimiento: fechaNacimiento,
          sexo,
          domicilio,
          localidad,
          cod_postal: codPostal,
          provincia,
          telefono,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        const mensajeError =
          data && data.error
            ? data.error
            : textosPanel.errorGuardar || "No se pudo guardar el perfil.";
        throw new Error(mensajeError);
      }
      setModal({
        tipo: "exito",
        titulo: textosPanel.exitoGuardar || "Perfil actualizado",
        mensaje:
          textosPanel.exitoGuardarMensaje || "Datos guardados correctamente.",
      });
      setEditando(false);
      cargarPerfil();
    } catch (err) {
      setModal({
        tipo: "error",
        titulo: "Error",
        mensaje:
          err.message ||
          textosPanel.errorGuardar ||
          "No se pudo guardar el perfil.",
      });
    }
  };

  const cambiarContrasena = async () => {
    try {
      const resp = await fetch(`${backendUrl}/api/admin/cambiar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password_actual: passActual,
          password_nueva: passNueva,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        const mensajeError =
          data && data.error
            ? data.error
            : textosPanel.errorPass || "Error al cambiar contraseña";
        throw new Error(mensajeError);
      }
      setModal({
        tipo: "exito",
        titulo: textosPanel.exitoPass || "Contraseña actualizada",
        mensaje:
          textosPanel.exitoPassMensaje || "Contraseña cambiada correctamente.",
      });
      setCambiandoPass(false);
      setPassActual("");
      setPassNueva("");
    } catch (err) {
      setModal({
        tipo: "error",
        titulo: "Error",
        mensaje:
          err.message || textosPanel.errorPass || "Error al cambiar contraseña",
      });
    }
  };

  const subirFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const reader = new FileReader();
    reader.onload = () => {
      const fotoBase64 = reader.result;
      fetch(`${backendUrl}/api/admin/subir-foto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foto_base64: fotoBase64 }),
      })
        .then((resp) => {
          if (!resp.ok) {
            return resp.json().then((err) => {
              throw new Error(err.error || "Error al subir");
            });
          }
          return resp.json();
        })
        .then(() => {
          cargarPerfil();
          setModal({
            tipo: "exito",
            titulo: "Foto actualizada",
            mensaje: "La foto se subió correctamente.",
          });
        })
        .catch((err) =>
          setModal({ tipo: "error", titulo: "Error", mensaje: err.message }),
        );
    };
    reader.readAsDataURL(archivo);
  };

  if (cargando) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: tema.texto }}>
        <FaSpinner
          style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}
        />
        <p style={{ marginTop: "1rem" }}>Cargando perfil...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: "800px", margin: "0 auto", color: tema.texto }}
    >
      {modal && (
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
          onClick={() => setModal(null)}
        >
          <div
            style={{
              backgroundColor: tema.fondo,
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              border: `2px solid ${modal.tipo === "exito" ? tema.exito : tema.error}`,
              boxShadow: `0 0 15px ${modal.tipo === "exito" ? tema.exito : tema.error}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {modal.tipo === "exito" ? (
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
                marginBottom: "0.5rem",
              }}
            >
              {modal.titulo}
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: tema.texto + "80",
                marginBottom: "1.5rem",
              }}
            >
              {modal.mensaje}
            </p>
            <button
              onClick={() => setModal(null)}
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
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: tema.fondoAlt,
          borderRadius: "16px",
          padding: "2rem",
          border: `1px solid ${tema.bordeSuave}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              margin: 0,
              color: tema.texto,
            }}
          >
            {textosPanel.titulo || "Mi Perfil"}
          </h2>
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: tema.primario,
                color: "#FFFFFF",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaEdit /> {textosPanel.editar || "Editar"}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setEditando(false)}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "10px",
                  border: `1px solid ${tema.error}`,
                  backgroundColor: "transparent",
                  color: tema.error,
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {textosPanel.cancelar || "Cancelar"}
              </button>
              <button
                onClick={guardarPerfil}
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: tema.exito,
                  color: "#FFFFFF",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {textosPanel.guardar || "Guardar"}
              </button>
            </div>
          )}
        </div>

        {/* FOTO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <label
            htmlFor="subir-foto-input"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: tema.primario + "20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: tema.primario,
              fontSize: "1.2rem",
            }}
          >
            <FaCamera />
          </label>
          <input
            id="subir-foto-input"
            type="file"
            accept="image/*"
            onChange={subirFoto}
            style={{ display: "none" }}
          />
          <div>
            <p style={{ fontWeight: "bold", fontSize: "1.1rem", margin: 0 }}>
              {perfil?.nombre || "Administrador"} {perfil?.apellido || ""}
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "0.85rem",
                color: tema.primario,
                fontWeight: "600",
              }}
            >
              {cerebroFront.textos.panelAdmin.sidebar.rango}
            </p>
          </div>
        </div>

        {/* DATOS (ficha o formulario) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "1rem",
            textAlign: "left",
          }}
        >
          {/* Username (SIEMPRE ficha) */}
          <FichaCampo
            label={textosReg.campoUsername || "Usuario"}
            valor={perfil?.username}
            icono={<FaUser />}
            tema={tema}
          />

          {editando ? (
            <>
              <CampoFlotante
                icon={<FaUser />}
                tipo="text"
                value={nombre}
                onChange={setNombre}
                label={textosReg.campoNombre || "Nombre"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaUser />}
                tipo="text"
                value={apellido}
                onChange={setApellido}
                label={textosReg.campoApellido || "Apellido"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaEnvelope />}
                tipo="email"
                value={email}
                onChange={setEmail}
                label={textosPanel.email || "Email"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
                error={
                  email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? cerebroFront.textos.registro.emailInvalido ||
                      "Formato de correo inválido"
                    : null
                }
              />
              <CampoFlotante
                icon={<FaIdCard />}
                tipo="text"
                value={dni}
                onChange={(v) => setDni(v.replace(/\D/g, ""))}
                label={textosReg.campoDni || "DNI"}
                placeholder=""
                obligatorio
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaCalendarAlt />}
                tipo="date"
                value={fechaNacimiento}
                onChange={setFechaNacimiento}
                label={textosPanel.fechaNacimiento || "Fecha de nacimiento"}
                placeholder=" "
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoSelect
                icon={<FaVenusMars />}
                value={sexo}
                onChange={setSexo}
                label={textosPanel.sexo || "Sexo"}
                placeholder={textosPanel.placeholderSexo || "Seleccionar sexo…"}
                obligatorio
                tema={tema}
                marginBottom="0"
                opciones={[
                  { valor: "masculino", etiqueta: "Masculino" },
                  { valor: "femenino", etiqueta: "Femenino" },
                  { valor: "otro", etiqueta: "Otro" },
                ]}
              />
              <CampoFlotante
                icon={<FaHome />}
                tipo="text"
                value={domicilio}
                onChange={setDomicilio}
                label={textosPanel.domicilio || "Domicilio"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaCity />}
                tipo="text"
                value={localidad}
                onChange={setLocalidad}
                label={textosPanel.localidad || "Localidad"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaMapMarkerAlt />}
                tipo="text"
                value={codPostal}
                onChange={setCodPostal}
                label={textosPanel.codPostal || "Código Postal"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaGlobeAmericas />}
                tipo="text"
                value={provincia}
                onChange={setProvincia}
                label={textosPanel.provincia || "Provincia"}
                placeholder=""
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
              <CampoFlotante
                icon={<FaPhone />}
                tipo="text"
                value={telefono}
                onChange={setTelefono}
                label={textosPanel.telefono || "Teléfono"}
                placeholder={
                  textosPanel.placeholderTelefono || "Ingresá tu teléfono"
                }
                obligatorio
                tema={tema}
                estilos={estilos}
                marginBottom="0"
              />
            </>
          ) : (
            <>
              <FichaCampo
                label={textosReg.campoNombre || "Nombre"}
                valor={perfil?.nombre}
                icono={<FaUser />}
                tema={tema}
              />
              <FichaCampo
                label={textosReg.campoApellido || "Apellido"}
                valor={perfil?.apellido}
                icono={<FaUser />}
                tema={tema}
              />
              <FichaCampo
                label={textosReg.campoEmail || "Email"}
                valor={perfil?.email}
                icono={<FaEnvelope />}
                tema={tema}
              />
              <FichaCampo
                label={textosReg.campoDni || "DNI"}
                valor={perfil?.dni}
                icono={<FaIdCard />}
                tema={tema}
              />
              <FichaCampo
                label={textosPanel.fechaNacimiento || "Fecha de nacimiento"}
                valor={perfil?.fecha_nacimiento}
                icono={<FaCalendarAlt />}
                tema={tema}
                esFecha
              />
              <FichaCampo
                label={textosPanel.sexo || "Sexo"}
                valor={perfil?.sexo}
                icono={<FaVenusMars />}
                tema={tema}
              />
              <FichaCampo
                label={textosPanel.domicilio || "Domicilio"}
                valor={perfil?.domicilio}
                icono={<FaHome />}
                tema={tema}
              />
              <FichaCampo
                label={textosPanel.localidad || "Localidad"}
                valor={perfil?.localidad}
                icono={<FaCity />}
                tema={tema}
              />
              <FichaCampo
                label={textosPanel.codPostal || "Código Postal"}
                valor={perfil?.cod_postal}
                icono={<FaMapMarkerAlt />}
                tema={tema}
              />
              <FichaCampo
                label={textosPanel.provincia || "Provincia"}
                valor={perfil?.provincia}
                icono={<FaGlobeAmericas />}
                tema={tema}
              />
              <FichaCampo
                label={textosPanel.telefono || "Teléfono"}
                valor={perfil?.telefono}
                icono={<FaPhone />}
                tema={tema}
              />
            </>
          )}
        </div>

        {/* CAMBIO DE CONTRASEÑA */}
        <div
          style={{
            marginTop: "2rem",
            borderTop: `1px solid ${tema.bordeSuave}`,
            paddingTop: "1.5rem",
          }}
        >
          <button
            onClick={() => setCambiandoPass(!cambiandoPass)}
            style={{
              background: "none",
              border: "none",
              color: tema.primario,
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
          >
            <FaLock style={{ marginRight: "0.5rem" }} />
            {textosPanel.cambiarContrasena || "Cambiar contraseña"}
          </button>
          {cambiandoPass && (
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <CampoFlotante
                  icon={<FaLock />}
                  tipo={mostrarPassActual ? "text" : "password"}
                  value={passActual}
                  onChange={setPassActual}
                  label={textosPanel.passActual || "Contraseña actual"}
                  placeholder=""
                  tema={tema}
                  estilos={estilos}
                  marginBottom="0"
                />
                <span
                  onClick={() => setMostrarPassActual(!mostrarPassActual)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "1rem",
                    cursor: "pointer",
                    color: tema.texto + "60",
                    fontSize: "1.2rem",
                  }}
                >
                  {mostrarPassActual ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <CampoFlotante
                  icon={<FaLock />}
                  tipo={mostrarPassNueva ? "text" : "password"}
                  value={passNueva}
                  onChange={setPassNueva}
                  label={textosPanel.passNueva || "Nueva contraseña"}
                  placeholder=""
                  tema={tema}
                  estilos={estilos}
                  marginBottom="0"
                />
                <span
                  onClick={() => setMostrarPassNueva(!mostrarPassNueva)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "1rem",
                    cursor: "pointer",
                    color: tema.texto + "60",
                    fontSize: "1.2rem",
                  }}
                >
                  {mostrarPassNueva ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button
                  onClick={cambiarContrasena}
                  disabled={!passActual || !passNueva}
                  style={{
                    padding: "0.7rem 1.5rem",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: tema.primario,
                    color: "#FFFFFF",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: !passActual || !passNueva ? 0.5 : 1,
                  }}
                >
                  {textosPanel.actualizarPass || "Actualizar contraseña"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FichaCampo = ({ label, valor, icono, tema, esFecha }) => {
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    const partes = fechaISO.split("T")[0]; // "1969-10-25"
    if (!partes) return fechaISO;
    const [anio, mes, dia] = partes.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem",
        backgroundColor: tema.fondoAlt,
        borderRadius: "10px",
        border: `1px solid ${tema.bordeSuave}`,
      }}
    >
      <span style={{ fontSize: "1.2rem", color: tema.primario }}>{icono}</span>
      <div>
        <p
          style={{
            fontSize: "0.75rem",
            color: tema.texto + "60",
            margin: "0 0 0.15rem",
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: "0.95rem", fontWeight: "500", margin: 0 }}>
          {esFecha ? formatearFecha(valor) : valor || "—"}
        </p>
      </div>
    </div>
  );
};

export default MiPerfil;
