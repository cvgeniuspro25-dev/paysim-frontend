// frontend/src/components/Faq.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Faq = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.faq;
  const textos = cerebroFront.textos.faq;
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: estilos.staggerChildren },
    },
  };

  const itemVariants = {
    hidden: { y: estilos.itemInitialY, opacity: estilos.itemInitialOpacity },
    visible: {
      y: estilos.itemAnimateY,
      opacity: estilos.itemAnimateOpacity,
      transition: { duration: estilos.itemTransitionDuration },
    },
  };

  return (
    <section
      id="faq"
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
            textAlign: estilos.titleTextAlign,
            marginBottom: estilos.titleMarginBottom,
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
        >
          {textos.items.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                style={{
                  marginBottom: estilos.accordionMarginBottom,
                  border: `${estilos.accordionBorder} ${temaActivo.texto}${Math.round(
                    estilos.accordionBorderColorOpacity * 255,
                  )
                    .toString(16)
                    .padStart(2, "0")}`,
                  borderRadius: estilos.accordionBorderRadius,
                  boxShadow: estilos.accordionBoxShadow,
                  overflow: estilos.accordionOverflow,
                  backgroundColor: temaActivo.fondo,
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  style={{
                    padding: estilos.questionPadding,
                    fontSize: estilos.questionFontSize,
                    fontWeight: estilos.questionFontWeight,
                    backgroundColor: isOpen
                      ? `${temaActivo.primario}${Math.round(
                          estilos.questionHoverBgOpacity * 255,
                        )
                          .toString(16)
                          .padStart(2, "0")}`
                      : temaActivo.fondo,
                    cursor: estilos.questionCursor,
                    display: estilos.questionDisplay,
                    justifyContent: estilos.questionJustifyContent,
                    alignItems: estilos.questionAlignItems,
                    width: estilos.questionWidth,
                    border: estilos.questionBorder,
                    transition: estilos.questionTransition,
                    color: temaActivo.texto,
                  }}
                >
                  <span>{item.pregunta}</span>
                  <FaChevronDown
                    style={{
                      fontSize: estilos.iconFontSize,
                      transition: estilos.iconTransition,
                      transform: isOpen
                        ? estilos.iconTransformOpen
                        : estilos.iconTransformClosed,
                      color: temaActivo.primario,
                    }}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        opacity: estilos.answerContentInitialOpacity,
                        y: estilos.answerContentInitialY,
                      }}
                      animate={{
                        opacity: estilos.answerContentAnimateOpacity,
                        y: estilos.answerContentAnimateY,
                      }}
                      exit={{
                        opacity: estilos.answerContentInitialOpacity,
                        y: estilos.answerContentInitialY,
                      }}
                      transition={{
                        duration: estilos.answerContentTransitionDuration,
                      }}
                      style={{
                        padding: estilos.answerPadding,
                        fontSize: estilos.answerFontSize,
                        lineHeight: estilos.answerLineHeight,
                        opacity: estilos.answerOpacity,
                        color: temaActivo.texto,
                        textAlign: estilos.answerTextAlign,
                        backgroundColor: temaActivo.fondoAlt,
                        borderTop: `${estilos.answerBorderTop} ${temaActivo.texto}${Math.round(
                          estilos.answerBorderTopColorOpacity * 255,
                        )
                          .toString(16)
                          .padStart(2, "0")}`,
                      }}
                    >
                      {item.respuesta}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
