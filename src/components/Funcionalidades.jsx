// frontend/src/components/Funcionalidades.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaLock,
  FaCreditCard,
  FaChartLine,
  FaUsers,
  FaBell,
  FaFlask,
} from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Funcionalidades = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.funcionalidades;
  const textos = cerebroFront.textos.funcionalidades;

  const iconos = [FaLock, FaCreditCard, FaChartLine, FaUsers, FaBell, FaFlask];
  const funcionalidades = textos.items.map((item, index) => ({
    ...item,
    Icono: iconos[index],
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: estilos.staggerChildren },
    },
  };

  const cardVariants = {
    hidden: { y: estilos.cardInitialY, opacity: estilos.cardInitialOpacity },
    visible: {
      y: estilos.cardAnimateY,
      opacity: estilos.cardAnimateOpacity,
      transition: { duration: estilos.cardTransitionDuration },
    },
  };

  return (
    <section
      id="funcionalidades"
      style={{
        minHeight: estilos.minHeight,
        padding: estilos.padding,
        backgroundColor: temaActivo.fondoAlt,
      }}
    >
      <div
        style={{
          maxWidth: estilos.containerMaxWidth,
          margin: estilos.containerMargin,
        }}
      >
        <motion.div
          initial={{
            opacity: estilos.headerInitialOpacity,
            y: estilos.headerInitialY,
          }}
          whileInView={{
            opacity: estilos.headerAnimateOpacity,
            y: estilos.headerAnimateY,
          }}
          viewport={{ once: true }}
          transition={{ duration: estilos.headerTransitionDuration }}
          style={{
            textAlign: estilos.headerTextAlign,
            marginBottom: estilos.headerMarginBottom,
          }}
        >
          <h2
            style={{
              fontSize: estilos.titleFontSize,
              fontWeight: estilos.titleFontWeight,
              marginBottom: estilos.titleMarginBottom,
              color: temaActivo.texto,
            }}
          >
            {textos.tituloParte1}
            <span style={{ color: temaActivo.primario }}>
              {textos.tituloParte2}
            </span>
          </h2>
          <p
            style={{
              fontSize: estilos.subtitleFontSize,
              maxWidth: estilos.subtitleMaxWidth,
              margin: estilos.subtitleMargin,
              opacity: estilos.subtitleOpacity,
              color: temaActivo.texto,
            }}
          >
            {textos.subtitulo}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: estilos.gridDisplay,
            gridTemplateColumns: estilos.gridTemplateColumns,
            gap: estilos.gridGap,
          }}
        >
          {funcionalidades.map((func, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: estilos.cardHoverY,
                boxShadow: estilos.cardHoverBoxShadow,
              }}
              style={{
                backgroundColor: temaActivo.fondo,
                padding: estilos.cardPadding,
                borderRadius: estilos.cardBorderRadius,
                boxShadow: estilos.cardBoxShadow,
                border: `${estilos.cardBorderWidth} ${estilos.cardBorderStyle} ${temaActivo.primario}40`,
                transition: estilos.cardTransition,
              }}
            >
              <div
                style={{
                  fontSize: estilos.iconFontSize,
                  marginBottom: estilos.iconMarginBottom,
                  display: estilos.iconDisplay,
                  alignItems: estilos.iconAlignItems,
                  justifyContent: estilos.iconJustifyContent,
                  padding: estilos.iconPadding,
                  borderRadius: estilos.iconBorderRadius,
                  backgroundColor: `${temaActivo.primario}${Math.round(
                    estilos.iconBgOpacity * 255,
                  )
                    .toString(16)
                    .padStart(2, "0")}`,
                  color: temaActivo.primario,
                }}
              >
                <func.Icono />
              </div>
              <h3
                style={{
                  fontSize: estilos.cardTitleFontSize,
                  marginBottom: estilos.cardTitleMarginBottom,
                  color: temaActivo.texto,
                }}
              >
                {func.titulo}
              </h3>
              <p
                style={{
                  lineHeight: estilos.cardDescLineHeight,
                  opacity: estilos.cardDescOpacity,
                  color: temaActivo.texto,
                }}
              >
                {func.descripcion}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Funcionalidades;
