// frontend/src/components/Planes.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";
import ModalBase from "./ModalBase";
import PagoConsumo from "./PagoConsumo";

const Planes = () => {
  const temaActivo = getTemaActivo();
  const [periodo, setPeriodo] = useState("mensual");
  const handleSelectPlan = (planKey) => {
    localStorage.setItem("planSeleccionado", planKey);
    window.location.href = "/registro";
  };
  const [modalPagoConsumo, setModalPagoConsumo] = useState(false);
  const planesData = cerebroFront.planes;
  const estilos = cerebroFront.estilos.planes;
  const textosPlanes = cerebroFront.textos.planes;
  const botones = cerebroFront.textos.botones;

  const planesMostrar = ["free", "starter", "pro", "enterprise"];

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
      id="planes"
      style={{
        minHeight: estilos.minHeight,
        padding: estilos.padding,
        backgroundColor: temaActivo.fondo,
        overflowX: estilos.overflowX,
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
            {textosPlanes.tituloParte1}
            <span style={{ color: temaActivo.primario }}>
              {textosPlanes.tituloParte2}
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
            {textosPlanes.subtitulo}
          </p>

          <div
            style={{
              display: estilos.switchDisplay,
              backgroundColor: temaActivo[estilos.switchBackground],
              borderRadius: estilos.switchBorderRadius,
              padding: estilos.switchPadding,
            }}
          >
            <button
              onClick={() => setPeriodo("mensual")}
              style={{
                padding: estilos.switchButtonPadding,
                borderRadius: estilos.switchBorderRadius,
                border: "none",
                backgroundColor:
                  periodo === "mensual" ? temaActivo.primario : "transparent",
                color:
                  periodo === "mensual"
                    ? temaActivo.textoInverso
                    : temaActivo.texto,
                fontWeight: estilos.switchButtonFontWeight,
                cursor: estilos.switchButtonCursor,
                transition: estilos.switchButtonTransition,
              }}
            >
              {textosPlanes.switchMensual}
            </button>
            <button
              onClick={() => setPeriodo("anual")}
              style={{
                padding: estilos.switchButtonPadding,
                borderRadius: estilos.switchBorderRadius,
                border: "none",
                backgroundColor:
                  periodo === "anual" ? temaActivo.primario : "transparent",
                color:
                  periodo === "anual"
                    ? temaActivo.textoInverso
                    : temaActivo.texto,
                fontWeight: estilos.switchButtonFontWeight,
                cursor: estilos.switchButtonCursor,
                transition: estilos.switchButtonTransition,
              }}
            >
              {textosPlanes.switchAnual}
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: estilos.cardsContainerDisplay,
            flexDirection: estilos.cardsContainerFlexDirection,
            justifyContent: estilos.cardsContainerJustifyContent,
            alignItems: estilos.cardsContainerAlignItems,
            gap: estilos.cardsContainerGap,
            flexWrap: estilos.cardsContainerFlexWrap,
            paddingBottom: estilos.cardsContainerPaddingBottom,
          }}
        >
          {planesMostrar.map((planKey) => {
            const plan = planesData[planKey];
            const precioFinal =
              periodo === "anual"
                ? plan.precioMensual * 10
                : plan.precioMensual;
            const tokensMensuales =
              planKey === "free" ? plan.tokensIniciales : plan.tokensMensuales;

            return (
              <motion.div
                key={planKey}
                variants={cardVariants}
                whileHover={{ y: estilos.cardHoverY }}
                style={{
                  backgroundColor: temaActivo.fondo,
                  padding: estilos.cardPadding,
                  borderRadius: estilos.cardBorderRadius,
                  boxShadow: estilos.cardBoxShadow,
                  border: `${estilos.borderWidth} solid ${planKey === "pro" ? temaActivo.primario : temaActivo.bordeSuave}`,
                  position: estilos.cardPosition,
                  transition: estilos.cardTransition,
                  flex: estilos.cardFlex,
                  minWidth: estilos.cardMinWidth,
                  maxWidth: estilos.cardMaxWidth,
                }}
              >
                {planKey === "pro" && (
                  <div
                    style={{
                      position: estilos.popularBadgePosition,
                      top: estilos.popularBadgeTop,
                      left: estilos.popularBadgeLeft,
                      transform: estilos.popularBadgeTransform,
                      backgroundColor: temaActivo.secundario,
                      color: temaActivo.textoInverso,
                      padding: estilos.popularBadgePadding,
                      borderRadius: estilos.popularBadgeBorderRadius,
                      fontSize: estilos.popularBadgeFontSize,
                      fontWeight: estilos.popularBadgeFontWeight,
                      whiteSpace: estilos.popularBadgeWhiteSpace,
                    }}
                  >
                    {textosPlanes.etiquetaPopular}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: estilos.cardTitleFontSize,
                    marginBottom: estilos.cardTitleMarginBottom,
                    color: temaActivo.texto,
                  }}
                >
                  {plan.nombre}
                </h3>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span
                    style={{
                      fontSize: estilos.precioFontSize,
                      fontWeight: estilos.precioFontWeight,
                      color: temaActivo.texto,
                    }}
                  >
                    {textosPlanes.moneda}
                    {precioFinal}
                  </span>
                  <span style={{ opacity: estilos.precioPeriodoOpacity }}>
                    {" "}
                    / {periodo === "mensual" ? "mes" : "año"}
                  </span>
                </div>
                <ul
                  style={{
                    listStyle: estilos.listStyle,
                    padding: estilos.listPadding,
                    marginBottom: estilos.listMarginBottom,
                  }}
                >
                  <li
                    style={{
                      display: estilos.listItemDisplay,
                      alignItems: estilos.listItemAlignItems,
                      gap: estilos.listItemGap,
                      marginBottom: estilos.listItemMarginBottom,
                      fontSize: estilos.featureFontSize,
                    }}
                  >
                    <FaCheck
                      style={{
                        color: temaActivo.exito,
                        fontSize: estilos.checkIconFontSize,
                      }}
                    />
                    <span>
                      {tokensMensuales} tokens{" "}
                      {planKey === "free" ? "(una vez)" : "/mes"}
                    </span>
                  </li>
                  <li
                    style={{
                      display: estilos.listItemDisplay,
                      alignItems: estilos.listItemAlignItems,
                      gap: estilos.listItemGap,
                      marginBottom: estilos.listItemMarginBottom,
                      fontSize: estilos.featureFontSize,
                    }}
                  >
                    <FaCheck
                      style={{
                        color: temaActivo.exito,
                        fontSize: estilos.checkIconFontSize,
                      }}
                    />
                    <span>{textosPlanes.caracteristicas.tokensExtra}</span>
                  </li>
                  {plan.permiteEmpleados && (
                    <>
                      <li
                        style={{
                          display: estilos.listItemDisplay,
                          alignItems: estilos.listItemAlignItems,
                          gap: estilos.listItemGap,
                          marginBottom: estilos.listItemMarginBottom,
                          fontSize: estilos.featureFontSize,
                        }}
                      >
                        <FaCheck
                          style={{
                            color: temaActivo.exito,
                            fontSize: estilos.checkIconFontSize,
                          }}
                        />
                        <span>Hasta {plan.maxEmpleados} empleados</span>
                      </li>
                      <li
                        style={{
                          display: estilos.listItemDisplay,
                          alignItems: estilos.listItemAlignItems,
                          gap: estilos.listItemGap,
                          marginBottom: estilos.listItemMarginBottom,
                          fontSize: estilos.featureFontSize,
                        }}
                      >
                        <FaCheck
                          style={{
                            color: temaActivo.exito,
                            fontSize: estilos.checkIconFontSize,
                          }}
                        />
                        <span>
                          {textosPlanes.caracteristicas.paquetesEmpleados}
                        </span>
                      </li>
                    </>
                  )}
                  <li
                    style={{
                      display: estilos.listItemDisplay,
                      alignItems: estilos.listItemAlignItems,
                      gap: estilos.listItemGap,
                      marginBottom: estilos.listItemMarginBottom,
                      fontSize: estilos.featureFontSize,
                    }}
                  >
                    <FaCheck
                      style={{
                        color: temaActivo.exito,
                        fontSize: estilos.checkIconFontSize,
                      }}
                    />
                    <span>
                      {textosPlanes.caracteristicas.tokensAcumulables}
                    </span>
                  </li>
                  <li
                    style={{
                      display: estilos.listItemDisplay,
                      alignItems: estilos.listItemAlignItems,
                      gap: estilos.listItemGap,
                      marginBottom: estilos.listItemMarginBottom,
                      fontSize: estilos.featureFontSize,
                    }}
                  >
                    <FaCheck
                      style={{
                        color: temaActivo.exito,
                        fontSize: estilos.checkIconFontSize,
                      }}
                    />
                    <span>{textosPlanes.caracteristicas.soporteEmail}</span>
                  </li>
                </ul>
                <motion.button
                  onClick={() => handleSelectPlan(planKey)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: estilos.buttonWidth,
                    padding: estilos.buttonPadding,
                    borderRadius: estilos.buttonBorderRadius,
                    border: `${estilos.buttonBorderWidth} ${estilos.buttonBorderStyle} ${temaActivo.primario}`,
                    backgroundColor:
                      planKey === "pro"
                        ? temaActivo.primario
                        : estilos.buttonBackgroundTransparent,
                    color:
                      planKey === "pro"
                        ? temaActivo.textoInverso
                        : temaActivo.primario,
                    fontWeight: estilos.buttonFontWeight,
                    cursor: estilos.buttonCursor,
                    transition: estilos.buttonTransition,
                    fontSize: estilos.featureFontSize,
                  }}
                >
                  {planKey === "free"
                    ? botones.comenzarGratis
                    : botones.seleccionarPlan}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: estilos.consumoMarginTop,
            padding: estilos.consumoPadding,
            textAlign: estilos.consumoTextAlign,
            borderTop: estilos.consumoBorderTop,
          }}
        >
          <p
            style={{
              fontSize: estilos.consumoPreguntaFontSize,
              marginBottom: estilos.consumoPreguntaMarginBottom,
              color: temaActivo.texto,
            }}
          >
            {textosPlanes.preguntaConsumo}
          </p>
          <button
            onClick={() => setModalPagoConsumo(true)}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "transparent",
              color: temaActivo.primario,
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {botones.conocePagoConsumo}
          </button>
        </motion.div>
      </div>
      {modalPagoConsumo && (
        <ModalBase
          isOpen={modalPagoConsumo}
          onClose={() => setModalPagoConsumo(false)}
          titulo={planesData.payAsYouGo.nombre}
        >
          <PagoConsumo
            onClose={() => setModalPagoConsumo(false)}
            onSelectPlan={() => setModalPagoConsumo(false)}
          />
        </ModalBase>
      )}
    </section>
  );
};

export default Planes;
