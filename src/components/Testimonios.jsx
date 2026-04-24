// frontend/src/components/Testimonios.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Testimonios = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.testimonios;
  const textos = cerebroFront.textos.testimonios;

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

  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacion) {
        estrellas.push(<FaStar key={i} color={temaActivo.advertencia} />);
      } else if (i - 0.5 <= calificacion) {
        estrellas.push(
          <FaStarHalfAlt key={i} color={temaActivo.advertencia} />,
        );
      } else {
        estrellas.push(
          <FaRegStar
            key={i}
            color={temaActivo.texto}
            opacity={estilos.estrellaInactivaOpacity}
          />,
        );
      }
    }
    return estrellas;
  };

  return (
    <section
      id="testimonios"
      style={{
        minHeight: estilos.minHeight,
        padding: estilos.padding,
        backgroundColor: temaActivo.fondoAlt,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
          style={{
            display: estilos.gridDisplay,
            gridTemplateColumns: estilos.gridTemplateColumns,
            gap: estilos.gridGap,
          }}
        >
          {textos.items.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: estilos.cardHoverY }}
              style={{
                backgroundColor: temaActivo.fondo,
                padding: estilos.cardPadding,
                borderRadius: estilos.cardBorderRadius,
                boxShadow: estilos.cardBoxShadow,
                border: `${estilos.cardBorder} ${temaActivo.texto}${Math.round(
                  estilos.cardBorderColorOpacity * 255,
                )
                  .toString(16)
                  .padStart(2, "0")}`,
                textAlign: estilos.cardTextAlign,
                transition: estilos.cardTransition,
              }}
            >
              <img
                src={`${estilos.urlFotoBase}${item.fotoId}`}
                alt={item.nombre}
                style={{
                  width: estilos.fotoWidth,
                  height: estilos.fotoHeight,
                  borderRadius: estilos.fotoBorderRadius,
                  objectFit: estilos.fotoObjectFit,
                  marginBottom: estilos.fotoMarginBottom,
                  border: `${estilos.fotoBorder} ${temaActivo.primario}`,
                }}
              />
              <h3
                style={{
                  fontSize: estilos.nombreFontSize,
                  fontWeight: estilos.nombreFontWeight,
                  marginBottom: estilos.nombreMarginBottom,
                  color: temaActivo.texto,
                }}
              >
                {item.nombre}
              </h3>
              <p
                style={{
                  fontSize: estilos.detalleFontSize,
                  opacity: estilos.detalleOpacity,
                  marginBottom: estilos.detalleMarginBottom,
                  color: temaActivo.texto,
                }}
              >
                {item.puesto}
              </p>
              <p
                style={{
                  fontSize: estilos.detalleFontSize,
                  opacity: estilos.detalleOpacity,
                  marginBottom: estilos.detalleMarginBottom,
                  color: temaActivo.texto,
                }}
              >
                {item.localidad}
              </p>
              <p
                style={{
                  fontSize: estilos.detalleFontSize,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  opacity: estilos.detalleOpacity,
                  marginBottom: "1rem",
                  color: temaActivo.texto,
                }}
              >
                "{item.testimonio}"
              </p>
              <div
                style={{
                  display: estilos.estrellasContainerDisplay,
                  justifyContent: estilos.estrellasContainerJustifyContent,
                  gap: estilos.estrellasContainerGap,
                  fontSize: estilos.estrellasFontSize,
                }}
              >
                {renderEstrellas(item.calificacion)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonios;
