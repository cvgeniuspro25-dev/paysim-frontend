// frontend/src/components/Timeline.jsx
import React from "react";
import { motion } from "framer-motion";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Timeline = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.timeline;
  const textos = cerebroFront.textos.timeline;

  const pasos = textos.pasos;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: estilos.staggerChildren },
    },
  };

  const itemVariants = {
    hidden: { opacity: estilos.itemInitialOpacity, x: estilos.itemInitialX },
    visible: {
      opacity: estilos.itemAnimateOpacity,
      x: estilos.itemAnimateX,
      transition: { duration: estilos.itemTransitionDuration },
    },
  };

  return (
    <section
      id="timeline"
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
        <motion.h2
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
            fontSize: estilos.titleFontSize,
            fontWeight: estilos.titleFontWeight,
            textAlign: estilos.titleTextAlign,
            marginBottom: estilos.titleMarginBottom,
            color: temaActivo.texto,
          }}
        >
          {textos.tituloParte1}
          <span style={{ color: temaActivo.primario }}>
            {textos.tituloParte2}
          </span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: estilos.stepsContainerDisplay,
            flexDirection: estilos.stepsContainerFlexDirection,
            gap: estilos.stepsContainerGap,
            position: estilos.stepsContainerPosition,
          }}
        >
          <div
            style={{
              position: estilos.linePosition,
              left: estilos.lineLeft,
              top: estilos.lineTop,
              bottom: estilos.lineBottom,
              width: estilos.lineWidth,
              backgroundColor: `${temaActivo.primario}${Math.round(
                estilos.lineBgOpacity * 255,
              )
                .toString(16)
                .padStart(2, "0")}`,
              zIndex: estilos.lineZIndex,
            }}
            className="timeline-line"
          />

          {pasos.map((paso, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              style={{
                display: estilos.stepDisplay,
                gap: estilos.stepGap,
                position: estilos.stepPosition,
                zIndex: estilos.stepZIndex,
              }}
            >
              <div
                style={{
                  width: estilos.circleSize,
                  height: estilos.circleSize,
                  borderRadius: estilos.circleBorderRadius,
                  backgroundColor: temaActivo.primario,
                  display: estilos.circleDisplay,
                  alignItems: estilos.circleAlignItems,
                  justifyContent: estilos.circleJustifyContent,
                  fontSize: estilos.circleFontSize,
                  fontWeight: estilos.circleFontWeight,
                  color: temaActivo.textoInverso,
                  boxShadow: `0 0 0 ${estilos.circleBoxShadowSpread} ${temaActivo.fondo}`,
                  flexShrink: estilos.circleFlexShrink,
                }}
              >
                {paso.numero}
              </div>
              <div
                style={{
                  flex: estilos.stepContentFlex,
                  paddingTop: estilos.stepContentPaddingTop,
                }}
              >
                <h3
                  style={{
                    fontSize: estilos.stepTitleFontSize,
                    marginBottom: estilos.stepTitleMarginBottom,
                    color: temaActivo.texto,
                  }}
                >
                  {paso.titulo}
                </h3>
                <p
                  style={{
                    fontSize: estilos.stepDescFontSize,
                    lineHeight: estilos.stepDescLineHeight,
                    opacity: estilos.stepDescOpacity,
                    color: temaActivo.texto,
                  }}
                >
                  {paso.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx="true">{`
        @media (max-width: ${cerebroFront.breakpoints.tablet}) {
          .timeline-line {
            left: ${estilos.responsiveLineLeft} !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
