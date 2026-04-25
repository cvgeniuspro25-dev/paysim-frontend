// frontend/src/components/ModalDemo.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const ModalDemo = ({ isOpen, onClose, titulo, children }) => {
  const temaGlobal = getTemaActivo();
  const estilos = cerebroFront.estilos.modalDemo;

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
          transition={{ duration: 0.3 }}
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
            zIndex: 10000,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: estilos.containerMaxWidth,
              width: estilos.containerWidth,
              maxHeight: estilos.containerMaxHeight,
              backgroundColor: temaGlobal.fondo,
              borderRadius: estilos.containerBorderRadius,
              boxShadow: estilos.containerBoxShadow,
              display: estilos.containerDisplay,
              flexDirection: estilos.containerFlexDirection,
              overflow: estilos.bodyOverflow,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: estilos.headerPadding,
                borderBottom: `${estilos.headerBorderBottom} ${temaGlobal.texto}20`,
                display: estilos.headerDisplay,
                justifyContent: estilos.headerJustifyContent,
                alignItems: estilos.headerAlignItems,
              }}
            >
              <h2
                style={{
                  fontSize: estilos.headerTitleFontSize,
                  fontWeight: estilos.headerTitleFontWeight,
                  color: temaGlobal.texto,
                  margin: 0,
                }}
              >
                {titulo}
              </h2>
              <span
                onClick={onClose}
                style={{
                  fontSize: estilos.toggleIconSize,
                  cursor: estilos.toggleCursor,
                  color: temaGlobal.texto,
                }}
              >
                <FaTimes />
              </span>
            </div>

            {/* Body */}
            <div
              style={{
                padding: estilos.bodyPadding,
                overflow: estilos.bodyOverflow,
                flex: estilos.bodyFlex,
                color: temaGlobal.texto,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalDemo;