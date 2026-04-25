// frontend/src/components/InfoModos.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const InfoModos = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.infoModos;
  const textos = cerebroFront.textos.infoModos;
  const [modoActivo, setModoActivo] = useState("developer");

  const pestanas = [
    { id: "developer", label: textos.pestanas.developer },
    { id: "tester", label: textos.pestanas.tester },
    { id: "empresa", label: textos.pestanas.empresa },
  ];

  const contenidoActivo = textos[modoActivo];

  const opacidadToHex = (opacidad) =>
    Math.round(opacidad * 255)
      .toString(16)
      .padStart(2, "0");

  return (
    <section
      id="info-modos"
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
          textAlign: estilos.containerTextAlign,
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

        <div
          style={{
            display: estilos.pestanasContainerDisplay,
            justifyContent: estilos.pestanasContainerJustify,
            gap: estilos.pestanasContainerGap,
            marginBottom: estilos.pestanasContainerMarginBottom,
            flexWrap: estilos.pestanasContainerFlexWrap,
          }}
        >
          {pestanas.map((pestana) => {
            const isActive = modoActivo === pestana.id;
            const borderColor = isActive
              ? temaActivo.primario
              : temaActivo.primario +
                opacidadToHex(estilos.pestanaBorderOpacityInactiva);

            return (
              <button
                key={pestana.id}
                onClick={() => setModoActivo(pestana.id)}
                style={{
                  all: "unset",
                  padding: estilos.pestanaPadding,
                  fontSize: estilos.pestanaFontSize,
                  fontWeight: estilos.pestanaFontWeight,
                  borderRadius: estilos.pestanaBorderRadius,
                  border: `${estilos.pestanaBorderWidth} ${estilos.pestanaBorderStyle} ${borderColor}`,
                  backgroundColor: isActive
                    ? temaActivo.primario
                    : estilos.pestanaBackgroundTransparent,
                  color: isActive ? temaActivo.textoInverso : temaActivo.texto,
                  cursor: estilos.pestanaCursor,
                  boxShadow: "none",
                  outline: "none",
                  minWidth: estilos.pestanaMinWidth,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pestana.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={modoActivo}
            initial={{
              opacity: estilos.contentInitialOpacity,
              y: estilos.contentInitialY,
            }}
            animate={{
              opacity: estilos.contentAnimateOpacity,
              y: estilos.contentAnimateY,
            }}
            exit={{
              opacity: estilos.contentExitOpacity,
              y: estilos.contentExitY,
            }}
            transition={{ duration: estilos.contentTransitionDuration }}
            style={{
              backgroundColor: temaActivo.fondo,
              padding: estilos.contentPadding,
              borderRadius: estilos.contentBorderRadius,
              boxShadow: estilos.contentBoxShadow,
              border: `${estilos.contentBorderWidth} ${estilos.contentBorderStyle} ${temaActivo.primario}${opacidadToHex(estilos.contentBorderOpacity)}`,
            }}
          >
            <p
              style={{
                fontSize: estilos.descripcionFontSize,
                lineHeight: estilos.descripcionLineHeight,
                marginBottom: estilos.descripcionMarginBottom,
                color: temaActivo.texto,
                textAlign: estilos.descripcionTextAlign,
              }}
            >
              {contenidoActivo.descripcion}
            </p>
            <h3
              style={{
                fontSize: estilos.caracteristicasTitleFontSize,
                marginBottom: estilos.caracteristicasTitleMarginBottom,
                color: temaActivo.primario,
                textAlign: estilos.caracteristicasTitleTextAlign,
              }}
            >
              Características principales
            </h3>
            <ul
              style={{
                listStyle: estilos.listStyle,
                padding: estilos.listPadding,
                width: estilos.listWidth,
              }}
            >
              {contenidoActivo.caracteristicas.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{
                    opacity: estilos.listItemInitialOpacity,
                    x: estilos.listItemInitialX,
                  }}
                  animate={{
                    opacity: estilos.listItemAnimateOpacity,
                    x: estilos.listItemAnimateX,
                  }}
                  transition={{ delay: index * estilos.listItemDelayBase }}
                  style={{
                    display: estilos.listItemDisplay,
                    alignItems: estilos.listItemAlignItems,
                    gap: estilos.listItemGap,
                    marginBottom: estilos.listItemMarginBottom,
                    fontSize: estilos.descripcionFontSize,
                    lineHeight: estilos.listItemLineHeight,
                    color: temaActivo.texto,
                  }}
                >
                  <span
                    style={{
                      width: estilos.checkIconContainerWidth,
                      height: estilos.checkIconContainerHeight,
                      display: estilos.checkIconContainerDisplay,
                      alignItems: estilos.checkIconContainerAlignItems,
                      justifyContent: estilos.checkIconContainerJustifyContent,
                      flexShrink: estilos.checkIconContainerFlexShrink,
                    }}
                  >
                    <FaCheckCircle
                      style={{
                        color: temaActivo.exito,
                        fontSize: estilos.checkIconSize,
                      }}
                    />
                  </span>
                  <span
                    style={{
                      margin: estilos.itemMargin,
                      padding: estilos.itemPadding,
                      textAlign: estilos.itemTextAlign,
                    }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InfoModos;
