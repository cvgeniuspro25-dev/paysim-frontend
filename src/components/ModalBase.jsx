// frontend/src/components/ModalBase.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const ModalBase = ({ isOpen, onClose, titulo, children }) => {
  const temaGlobal = getTemaActivo();
  const estilos = cerebroFront.estilos.modal;
  const [temaModal, setTemaModal] = useState(temaGlobal.fondo === "#FFFFFF" ? "claro" : "oscuro");

  const coloresModal = cerebroFront.tema[temaModal];

  const toggleTemaModal = () => {
    setTemaModal((prev) => (prev === "claro" ? "oscuro" : "claro"));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: estilos.overlayBackground,
            display: estilos.overlayDisplay,
            alignItems: estilos.overlayAlignItems,
            justifyContent: estilos.overlayJustifyContent,
            paddingTop: estilos.overlayPaddingTop,
            zIndex: 10000,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              maxWidth: estilos.containerMaxWidth,
              width: estilos.containerWidth,
              maxHeight: estilos.containerMaxHeight,
              backgroundColor: coloresModal.fondo,
              borderRadius: estilos.containerBorderRadius,
              boxShadow: estilos.containerBoxShadow,
              display: estilos.containerDisplay,
              flexDirection: estilos.containerFlexDirection,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: estilos.headerPadding,
                borderBottom: `${estilos.headerBorderBottom} ${coloresModal.bordeSuave}`,
                display: estilos.headerDisplay,
                justifyContent: estilos.headerJustifyContent,
                alignItems: estilos.headerAlignItems,
              }}
            >
              <h2
                style={{
                  fontSize: estilos.headerTitleFontSize,
                  fontWeight: estilos.headerTitleFontWeight,
                  color: coloresModal.texto,
                  margin: 0,
                }}
              >
                {titulo}
              </h2>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span
                  onClick={toggleTemaModal}
                  style={{ fontSize: estilos.toggleIconSize, cursor: estilos.toggleCursor, color: coloresModal.texto }}
                >
                  {temaModal === "claro" ? <FaMoon /> : <FaSun />}
                </span>
                <span
                  onClick={onClose}
                  style={{ fontSize: estilos.toggleIconSize, cursor: estilos.toggleCursor, color: coloresModal.texto }}
                >
                  <FaTimes />
                </span>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                padding: estilos.bodyPadding,
                overflowY: estilos.bodyOverflowY,
                flex: estilos.bodyFlex,
                color: coloresModal.texto,
              }}
            >
              {children}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: estilos.footerPadding,
                borderTop: `${estilos.footerBorderTop} ${coloresModal.bordeSuave}`,
                display: estilos.footerDisplay,
                justifyContent: estilos.footerJustifyContent,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: estilos.cerrarButtonPadding,
                  borderRadius: estilos.cerrarButtonBorderRadius,
                  border: estilos.cerrarButtonBorder,
                  backgroundColor: coloresModal.primario,
                  color: coloresModal.textoInverso,
                  fontWeight: estilos.cerrarButtonFontWeight,
                  cursor: estilos.cerrarButtonCursor,
                }}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalBase;