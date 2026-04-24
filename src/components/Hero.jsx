// frontend/src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Hero = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.hero;
  const textos = cerebroFront.textos.hero;

  return (
    <section
      id="inicio"
      style={{
        minHeight: estilos.minHeight,
        padding: estilos.padding,
        display: estilos.display,
        alignItems: estilos.alignItems,
        justifyContent: estilos.justifyContent,
        position: estilos.position,
        overflow: estilos.overflow,
        backgroundColor: temaActivo.fondo,
      }}
    >
      {/* Círculo decorativo animado */}
      <motion.div
        initial={{
          scale: estilos.circleScaleStart,
          opacity: estilos.circleOpacityStart,
        }}
        animate={{
          scale: estilos.circleScaleEnd,
          opacity: estilos.circleOpacityEnd,
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: estilos.circlePosition,
          width: estilos.circleSize,
          height: estilos.circleSize,
          borderRadius: estilos.circleBorderRadius,
          background: `radial-gradient(circle, ${temaActivo.primario} 0%, transparent 70%)`,
          top: estilos.circleTop,
          right: estilos.circleRight,
          zIndex: estilos.circleZIndex,
        }}
      />

      <div
        style={{
          maxWidth: estilos.containerMaxWidth,
          margin: estilos.containerMargin,
          display: estilos.containerDisplay,
          alignItems: estilos.containerAlignItems,
          justifyContent: estilos.containerJustifyContent,
          flexWrap: estilos.containerFlexWrap,
          gap: estilos.containerGap,
          position: estilos.containerPosition,
          zIndex: estilos.containerZIndex,
        }}
      >
        {/* Columna de texto */}
        <motion.div
          initial={{
            x: estilos.motionInitialXText,
            opacity: estilos.motionInitialOpacity,
          }}
          animate={{
            x: estilos.motionAnimateX,
            opacity: estilos.motionAnimateOpacity,
          }}
          transition={{ duration: estilos.motionTransitionDuration }}
          style={{ flex: estilos.textColFlex }}
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: estilos.motionDelayTitle, duration: 0.6 }}
            style={{
              fontSize: estilos.titleFontSize,
              fontWeight: estilos.titleFontWeight,
              lineHeight: estilos.titleLineHeight,
              marginBottom: estilos.titleMarginBottom,
              color: temaActivo.texto,
            }}
          >
            {textos.tituloParte1}
            <span style={{ color: temaActivo.primario }}>
              {textos.tituloParte2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: estilos.motionDelayDesc, duration: 0.6 }}
            style={{
              fontSize: estilos.descFontSize,
              lineHeight: estilos.descLineHeight,
              marginBottom: estilos.descMarginBottom,
              color: temaActivo.texto,
              opacity: estilos.descOpacity,
              maxWidth: estilos.descMaxWidth,
            }}
          >
            {textos.descripcion}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: estilos.motionDelayButton, duration: 0.6 }}
            style={{
              display: estilos.buttonContainerDisplay,
              gap: estilos.buttonContainerGap,
              flexWrap: estilos.buttonContainerFlexWrap,
              justifyContent: estilos.buttonContainerJustifyContent,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: estilos.buttonPrimaryPadding,
                fontSize: estilos.buttonPrimaryFontSize,
                fontWeight: estilos.buttonPrimaryFontWeight,
                borderRadius: estilos.buttonPrimaryBorderRadius,
                border: estilos.buttonPrimaryBorder,
                backgroundColor: temaActivo.primario,
                color: temaActivo.textoInverso,
                cursor: estilos.buttonPrimaryCursor,
                boxShadow: `0 8px 20px ${temaActivo.primario}${Math.round(
                  estilos.buttonPrimaryBoxShadowOpacity * 255,
                )
                  .toString(16)
                  .padStart(2, "0")}`,
              }}
            >
              {cerebroFront.textos.botones.comenzarGratis}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: estilos.buttonPrimaryPadding,
                fontSize: estilos.buttonPrimaryFontSize,
                fontWeight: estilos.buttonPrimaryFontWeight,
                borderRadius: estilos.buttonPrimaryBorderRadius,
                border: `${estilos.buttonSecondaryBorderWidth} ${estilos.buttonSecondaryBorderStyle} ${temaActivo.primario}`,
                backgroundColor: estilos.buttonSecondaryBackground,
                color: temaActivo.primario,
                cursor: estilos.buttonPrimaryCursor,
              }}
            >
              {cerebroFront.textos.botones.verDemo}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: estilos.motionDelayStats, duration: 0.6 }}
            style={{
              display: estilos.statsContainerDisplay,
              gap: estilos.statsContainerGap,
              marginTop: estilos.statsContainerMarginTop,
              justifyContent: estilos.statsContainerJustifyContent,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: estilos.statNumberFontSize,
                  margin: estilos.statNumberMargin,
                  color: temaActivo.secundario,
                }}
              >
                {textos.estadisticas.devs}
              </h3>
              <p
                style={{
                  margin: estilos.statLabelMargin,
                  opacity: estilos.statLabelOpacity,
                }}
              >
                {textos.estadisticas.devsLabel}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: estilos.statNumberFontSize,
                  margin: estilos.statNumberMargin,
                  color: temaActivo.secundario,
                }}
              >
                {textos.estadisticas.precision}
              </h3>
              <p
                style={{
                  margin: estilos.statLabelMargin,
                  opacity: estilos.statLabelOpacity,
                }}
              >
                {textos.estadisticas.precisionLabel}
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: estilos.statNumberFontSize,
                  margin: estilos.statNumberMargin,
                  color: temaActivo.secundario,
                }}
              >
                {textos.estadisticas.soporte}
              </h3>
              <p
                style={{
                  margin: estilos.statLabelMargin,
                  opacity: estilos.statLabelOpacity,
                }}
              >
                {textos.estadisticas.soporteLabel}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Columna visual */}
        <motion.div
          initial={{
            x: estilos.motionInitialXVisual,
            opacity: estilos.motionInitialOpacity,
          }}
          animate={{
            x: estilos.motionAnimateX,
            opacity: estilos.motionAnimateOpacity,
          }}
          transition={{ duration: estilos.motionTransitionDuration }}
          style={{
            flex: estilos.visualColFlex,
            display: estilos.visualColDisplay,
            justifyContent: estilos.visualColJustifyContent,
            alignItems: estilos.visualColAlignItems,
          }}
        >
          <motion.div
            animate={{ y: estilos.motionFloatY }}
            transition={{
              duration: estilos.motionFloatDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: estilos.cardWidth,
              maxWidth: estilos.cardMaxWidth,
              height: estilos.cardHeight,
              padding: estilos.cardPadding,
              background: `linear-gradient(135deg, ${temaActivo.primario}20, ${temaActivo.secundario}20)`,
              borderRadius: estilos.cardBorderRadius,
              boxShadow: estilos.cardBoxShadow,
              backdropFilter: estilos.cardBackdropFilter,
              border: `${estilos.cardBorderWidth} ${estilos.cardBorderStyle} ${temaActivo.primario}30`,
              textAlign: estilos.cardTextAlign,
            }}
          >
            <svg
              viewBox="0 0 200 200"
              style={{ width: estilos.svgWidth, height: estilos.svgHeight }}
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                fill={temaActivo.primario}
                opacity={estilos.svgCircle1Opacity}
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                fill={temaActivo.primario}
                opacity={estilos.svgCircle2Opacity}
              />
              <circle cx="100" cy="100" r="40" fill={temaActivo.primario} />
              <text
                x="100"
                y="115"
                fontSize={estilos.svgTextFontSize}
                fontWeight={estilos.svgTextFontWeight}
                fill={temaActivo.textoInverso}
                textAnchor={estilos.svgTextAnchor}
              >
                $
              </text>
            </svg>
            <h3
              style={{
                marginTop: estilos.cardTitleMarginTop,
                color: temaActivo.texto,
              }}
            >
              {textos.visual.titulo}
            </h3>
            <p style={{ opacity: estilos.cardTextOpacity }}>
              {textos.visual.subtitulo}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
