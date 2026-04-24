// frontend/src/components/ContactForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaTag,
  FaComment,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const ContactForm = ({ onClose }) => {
  const temaGlobal = getTemaActivo();
  const estilos = cerebroFront.estilos.contactoForm;
  const textos = cerebroFront.textos.contacto;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [focoActivo, setFocoActivo] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const campoIconos = {
    nombre: FaUser,
    email: FaEnvelope,
    asunto: FaTag,
    mensaje: FaComment,
  };

  const campoLabel = {
    nombre: textos.campos.nombre,
    email: textos.campos.email,
    asunto: textos.campos.asunto,
    mensaje: textos.campos.mensaje,
  };

  const camposCompletos = Object.values(formData).filter(
    (val) => val.trim().length > 0,
  ).length;
  const totalCampos = 4;
  const progreso = Math.round((camposCompletos / totalCampos) * 100);
  const todosCompletos = camposCompletos === totalCampos;
  const emailValido = formData.email
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    : true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (campo) => setFocoActivo(campo);
  const handleBlur = () => setFocoActivo(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIntentoEnvio(true);
    if (todosCompletos && emailValido) {
      setEnviado(true);
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
      setIntentoEnvio(false);
    }
  };

  if (enviado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          textAlign: estilos.exitoContenedorTextAlign,
          padding: estilos.exitoContenedorPadding,
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          style={{
            width: estilos.exitoIconoContainerSize,
            height: estilos.exitoIconoContainerSize,
            borderRadius: estilos.exitoIconoContainerBorderRadius,
            backgroundColor: `${temaGlobal.exito}15`,
            display: estilos.exitoIconoContainerDisplay,
            alignItems: estilos.exitoIconoContainerAlignItems,
            justifyContent: estilos.exitoIconoContainerJustifyContent,
            margin: estilos.exitoIconoContainerMargin,
          }}
        >
          <FaCheckCircle
            style={{
              fontSize: estilos.exitoIconoSize,
              color: estilos.exitoIconoColor,
            }}
          />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: estilos.exitoTituloFontSize,
            fontWeight: estilos.exitoTituloFontWeight,
            color: estilos.exitoTituloColor,
            marginBottom: estilos.exitoTituloMarginBottom,
          }}
        >
          {textos.exitoTitulo}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: estilos.exitoMensajeFontSize,
            color: estilos.exitoMensajeColor,
            maxWidth: estilos.exitoMensajeMaxWidth,
            margin: estilos.exitoMensajeMargin,
          }}
        >
          {textos.exitoMensaje}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: estilos.exitoBotonMarginTop,
            padding: estilos.exitoBotonPadding,
            borderRadius: estilos.exitoBotonBorderRadius,
            border: `${estilos.exitoBotonBorder.replace("temaActivo.primario", temaGlobal.primario)}`,
            background: estilos.exitoBotonBackground,
            color: temaGlobal.primario,
            fontWeight: estilos.exitoBotonFontWeight,
            cursor: estilos.exitoBotonCursor,
            transition: estilos.exitoBotonTransition,
          }}
        >
          <FaArrowLeft style={{ marginRight: "0.5rem" }} />
          Cerrar
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        padding: estilos.contenedorPadding,
        borderRadius: estilos.contenedorBorderRadius,
        boxShadow: estilos.contenedorBoxShadow,
        border: `${estilos.contenedorBorder} ${temaGlobal.texto}10`,
        background: temaGlobal.fondo,
      }}
    >
      <p
        style={{
          color: temaGlobal.texto,
          marginBottom: estilos.progresoMarginBottom,
          fontSize: estilos.labelFontSize,
          textAlign: "center",
        }}
      >
        {textos.subtitulo}
      </p>

      {/* Barra de progreso */}
      <div
        style={{
          height: estilos.progresoAltura,
          borderRadius: estilos.progresoBorderRadius,
          background: `${temaGlobal.texto}15`,
          marginBottom: estilos.progresoMarginBottom,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progreso}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: estilos.progresoBorderRadius,
            background: `linear-gradient(90deg, ${temaGlobal.primario}, ${temaGlobal.secundario})`,
          }}
        />
      </div>

      {Object.keys(formData).map((key) => {
        const Icon = campoIconos[key];
        const isTextarea = key === "mensaje";
        const InputComponent = isTextarea ? "textarea" : "input";
        const tieneValor = formData[key].trim().length > 0;
        const tieneFoco = focoActivo === key;
        const mostrarError = intentoEnvio && !tieneValor;
        const emailError =
          key === "email" && intentoEnvio && !emailValido && tieneValor;

        let borderColor = `${temaGlobal.texto}20`;
        if (tieneFoco) borderColor = temaGlobal.primario;
        else if (mostrarError || emailError) borderColor = temaGlobal.error;
        else if (tieneValor && !emailError) borderColor = temaGlobal.exito;

        let iconColor = `${temaGlobal.texto}40`;
        if (tieneFoco) iconColor = temaGlobal.primario;
        else if (mostrarError || emailError) iconColor = temaGlobal.error;
        else if (tieneValor && !emailError) iconColor = temaGlobal.exito;

        return (
          <div
            key={key}
            style={{
              position: estilos.campoGrupoPosition,
              marginBottom: estilos.campoGrupoMarginBottom,
            }}
          >
            {/* Etiqueta flotante */}
            <label
              style={{
                position: estilos.labelPosition,
                left:
                  tieneValor || tieneFoco
                    ? estilos.labelLeftFloat
                    : estilos.labelLeft,
                top: tieneValor || tieneFoco ? "-0.6rem" : estilos.labelTop,
                fontSize:
                  tieneValor || tieneFoco ? "0.8rem" : estilos.labelFontSize,
                fontWeight: estilos.labelFontWeight,
                color: tieneFoco
                  ? temaGlobal.primario
                  : mostrarError || emailError
                    ? temaGlobal.error
                    : `${temaGlobal.texto}60`,
                transition: estilos.labelTransition,
                pointerEvents: estilos.labelPointerEvents,
                background: temaGlobal.fondo,
                padding: "0 0.4rem",
                zIndex: 1,
              }}
            >
              {campoLabel[key]}
            </label>

            {/* Icono */}
            <Icon
              style={{
                position: estilos.iconoPosition,
                left: estilos.iconoLeft,
                top: estilos.iconoTop,
                fontSize: estilos.iconoFontSize,
                color: iconColor,
                transition: estilos.iconoTransition,
                zIndex: 2,
                pointerEvents: "none",
              }}
            />

            {/* Input */}
            <InputComponent
              type={key === "email" ? "email" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              onFocus={() => {
                handleFocus(key);
                setTooltipVisible(key === "email");
              }}
              onBlur={() => {
                handleBlur();
                setTooltipVisible(false);
              }}
              placeholder=""
              style={{
                width: estilos.inputWidth,
                padding: estilos.inputPadding,
                border: `${estilos.inputBorder} ${borderColor}`,
                borderRadius: estilos.inputBorderRadius,
                fontSize: estilos.inputFontSize,
                background: temaGlobal.fondoAlt,
                color: temaGlobal.texto,
                transition: estilos.inputTransition,
                boxShadow: tieneFoco
                  ? `0 0 0 4px ${temaGlobal.primario}15`
                  : "none",
                outline: estilos.inputOutline,
                minHeight: isTextarea ? estilos.textareaMinHeight : "auto",
                resize: isTextarea ? estilos.textareaResize : "none",
              }}
            />

            {/* Mensaje de error */}
            <AnimatePresence>
              {(mostrarError || emailError) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  style={{
                    display: estilos.errorDisplay,
                    alignItems: estilos.errorAlignItems,
                    gap: estilos.errorGap,
                    marginTop: estilos.errorMarginTop,
                    marginLeft: estilos.errorMarginLeft,
                  }}
                >
                  <FaExclamationCircle
                    style={{
                      fontSize: estilos.errorIconoSize,
                      color: temaGlobal.error,
                    }}
                  />
                  <span
                    style={{
                      fontSize: estilos.errorFontSize,
                      color: temaGlobal.error,
                    }}
                  >
                    {emailError
                      ? "Ingrese un correo electrónico válido"
                      : "Este campo es obligatorio"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooltip de formato de email */}
            <AnimatePresence>
              {key === "email" && tooltipVisible && !tieneValor && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  style={{
                    position: estilos.tooltipPosition,
                    right: estilos.tooltipRight,
                    top: estilos.tooltipTop,
                    background: temaGlobal.fondo,
                    border: `${estilos.tooltipBorder.replace("temaActivo.texto + '20'", `${temaGlobal.texto}20`)}`,
                    borderRadius: estilos.tooltipBorderRadius,
                    padding: estilos.tooltipPadding,
                    fontSize: estilos.tooltipFontSize,
                    color: `${temaGlobal.texto}80`,
                    boxShadow: estilos.tooltipBoxShadow,
                  }}
                >
                  📧 ejemplo@correo.com
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Botón de envío */}
      <motion.button
        type="submit"
        disabled={!todosCompletos || !emailValido}
        whileHover={todosCompletos && emailValido ? { scale: 1.02, y: -3 } : {}}
        whileTap={todosCompletos && emailValido ? { scale: 0.98, y: -1 } : {}}
        style={{
          width: estilos.botonWidth,
          padding: estilos.botonPadding,
          borderRadius: estilos.botonBorderRadius,
          border: estilos.botonBorder,
          fontSize: estilos.botonFontSize,
          fontWeight: estilos.botonFontWeight,
          color: estilos.botonColor,
          background: `linear-gradient(135deg, ${temaGlobal.primario} 0%, ${temaGlobal.secundario} 100%)`,
          cursor:
            todosCompletos && emailValido
              ? estilos.botonCursor
              : estilos.botonDisabledCursor,
          boxShadow:
            todosCompletos && emailValido
              ? `0 8px 25px ${temaGlobal.primario}35`
              : "none",
          transition: estilos.botonTransition,
          opacity:
            todosCompletos && emailValido ? 1 : estilos.botonDisabledOpacity,
          marginTop: estilos.botonContenedorMarginTop,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
        }}
      >
        <FaPaperPlane />
        {textos.botonEnviar}
      </motion.button>
    </motion.form>
  );
};

export default ContactForm;
