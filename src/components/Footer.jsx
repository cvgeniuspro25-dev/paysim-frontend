// frontend/src/components/Footer.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaTag,
  FaComment,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";
import ContactForm from "./ContactForm";
import ModalBase from "./ModalBase";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Footer = () => {
  const temaGlobal = getTemaActivo();
  const estilosFooter = cerebroFront.estilos.footer;
  const estilosContacto = cerebroFront.estilos.contactoForm;
  const estilosAyuda = cerebroFront.estilos.ayuda;
  const estilosModal = cerebroFront.estilos.modal;
  const textosFooter = cerebroFront.textos.footer;
  const [modalActivo, setModalActivo] = useState(null);

  const [busquedaAyuda, setBusquedaAyuda] = useState("");

  const abrirModal = (modal) => {
    setModalActivo(modal);
  };
  const cerrarModal = () => setModalActivo(null);

  const contenidoFooter = [
    {
      titulo: textosFooter.columna1Titulo,
      enlaces: textosFooter.enlacesNavegacion.map((link) => ({
        texto: link.texto,
        accion: () => {
          const elemento = document.querySelector(link.ancla);
          if (elemento) elemento.scrollIntoView({ behavior: "smooth" });
        },
      })),
    },
    {
      titulo: textosFooter.columna2Titulo,
      enlaces: textosFooter.enlacesLegales.map((l) => ({
        texto: l.texto,
        accion: () => abrirModal(l.modal),
      })),
    },
    {
      titulo: textosFooter.columna3Titulo,
      enlaces: textosFooter.enlacesEmpresa.map((e) => ({
        texto: e.texto,
        accion: () => abrirModal(e.modal),
      })),
    },
    {
      titulo: textosFooter.columna4Titulo,
      enlaces: textosFooter.enlacesRecursos.map((r) => ({
        texto: r.texto,
        accion: () => {
          if (r.modal === "documentacion")
            window.open("/docs", "_blank", "noopener");
          else abrirModal(r.modal);
        },
      })),
    },
  ];

  const renderContenidoModal = () => {
    switch (modalActivo) {
      case "privacidad":
        return (
          <div>
            {cerebroFront.textos.politicaPrivacidad.contenido.map((p, i) => (
              <p
                key={i}
                style={{
                  marginBottom: "0.8rem",
                  textAlign: estilosModal.bodyTextAlign,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        );
      case "cookies":
        return (
          <div>
            {cerebroFront.textos.cookies.contenido.map((p, i) => (
              <p
                key={i}
                style={{
                  marginBottom: "0.8rem",
                  textAlign: estilosModal.bodyTextAlign,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        );
      case "condiciones":
        return (
          <div>
            {cerebroFront.textos.condicionesServicio.contenido.map((p, i) => (
              <p
                key={i}
                style={{
                  marginBottom: "0.8rem",
                  textAlign: estilosModal.bodyTextAlign,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        );
      case "quienesSomos":
        return (
          <div>
            {cerebroFront.textos.quienesSomos.contenido.map((p, i) => (
              <p
                key={i}
                style={{
                  marginBottom: "0.8rem",
                  textAlign: estilosModal.bodyTextAlign,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        );

      case "contacto":
        return <ContactForm onClose={cerrarModal} />;
      case "ayuda":
        const seccionesFiltradas = cerebroFront.textos.ayuda.secciones.filter(
          (sec) =>
            sec.titulo.toLowerCase().includes(busquedaAyuda.toLowerCase()) ||
            sec.contenido.toLowerCase().includes(busquedaAyuda.toLowerCase()),
        );
        return (
          <div>
            <div
              style={{
                position: "relative",
                marginBottom: estilosAyuda.buscadorMarginBottom,
              }}
            >
              <FaSearch
                style={{
                  position: estilosContacto.iconPosition,
                  left: estilosContacto.iconLeft,
                  top: estilosContacto.iconTop,
                  transform: estilosContacto.iconTransform,
                  color: temaGlobal.primario,
                }}
              />
              <input
                type="text"
                placeholder={cerebroFront.textos.ayuda.buscarPlaceholder}
                value={busquedaAyuda}
                onChange={(e) => setBusquedaAyuda(e.target.value)}
                style={{
                  width: estilosAyuda.buscadorWidth,
                  padding: estilosAyuda.buscadorPadding,
                  border: `${estilosAyuda.buscadorBorder} ${temaGlobal.texto}30`,
                  borderRadius: estilosAyuda.buscadorBorderRadius,
                  fontSize: estilosAyuda.buscadorFontSize,
                  backgroundColor: temaGlobal.fondoAlt,
                  color: temaGlobal.texto,
                }}
              />
            </div>
            {busquedaAyuda && seccionesFiltradas.length === 0 && (
              <p>{cerebroFront.textos.ayuda.sinResultados}</p>
            )}
            {seccionesFiltradas.map((sec, i) => (
              <div key={i}>
                <h3
                  style={{
                    fontSize: estilosAyuda.seccionTituloFontSize,
                    fontWeight: estilosAyuda.seccionTituloFontWeight,
                    marginTop: estilosAyuda.seccionTituloMarginTop,
                    marginBottom: estilosAyuda.seccionTituloMarginBottom,
                    color: temaGlobal.primario,
                  }}
                >
                  {sec.titulo}
                </h3>
                <p
                  style={{
                    lineHeight: estilosAyuda.seccionParrafoLineHeight,
                    marginBottom: estilosAyuda.seccionParrafoMarginBottom,
                  }}
                >
                  {sec.contenido}
                </p>
              </div>
            ))}
            {!busquedaAyuda && (
              <div>
                <h3
                  style={{
                    fontSize: estilosAyuda.pasoAPasoTituloFontSize,
                    fontWeight: estilosAyuda.pasoAPasoTituloFontWeight,
                    marginTop: estilosAyuda.pasoAPasoTituloMarginTop,
                    marginBottom: estilosAyuda.pasoAPasoTituloMarginBottom,
                    color: temaGlobal.secundario,
                  }}
                >
                  {cerebroFront.textos.ayuda.pasoAPasoTitulo}
                </h3>
                <ol style={{ paddingLeft: estilosAyuda.pasoListaPaddingLeft }}>
                  {cerebroFront.textos.ayuda.pasos.map((paso, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: estilosAyuda.pasoItemMarginBottom,
                        fontSize: estilosAyuda.pasoItemFontSize,
                      }}
                    >
                      {paso}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );

      case "estadoServicio":
        return (
          <div style={{ textAlign: estilosModal.bodyTextAlign }}>
            <h3 style={{ color: temaGlobal.exito }}>
              {cerebroFront.textos.estadoServicio.operativo}
            </h3>
            <p>{cerebroFront.textos.estadoServicio.rendimiento}</p>
            <p>
              <small>{cerebroFront.textos.estadoServicio.ultimaRevision}</small>
            </p>
            <p>{cerebroFront.textos.estadoServicio.incidentesRecientes}</p>
            <p>{cerebroFront.textos.estadoServicio.mantenimientoProgramado}</p>
          </div>
        );

      default:
        return null;
    }
  };

  const tituloModalActual = () => {
    const mapTitulos = {
      privacidad: cerebroFront.textos.politicaPrivacidad.titulo,
      cookies: cerebroFront.textos.cookies.titulo,
      condiciones: cerebroFront.textos.condicionesServicio.titulo,
      quienesSomos: cerebroFront.textos.quienesSomos.titulo,
      contacto: cerebroFront.textos.contacto.titulo,
      ayuda: cerebroFront.textos.ayuda.titulo,
      documentacion: cerebroFront.textos.documentacion.titulo,
      estadoServicio: cerebroFront.textos.estadoServicio.titulo,
    };
    return mapTitulos[modalActivo] || "";
  };

  return (
    <footer
      style={{
        padding: estilosFooter.padding,
        backgroundColor: temaGlobal.fondoAlt,
        borderTop: `${estilosFooter.borderTopWidth} ${estilosFooter.borderTopStyle} ${temaGlobal.texto}20`,
        color: temaGlobal.texto,
      }}
    >
      <div
        style={{
          maxWidth: estilosFooter.containerMaxWidth,
          margin: estilosFooter.containerMargin,
          display: estilosFooter.columnasDisplay,
          gridTemplateColumns: estilosFooter.columnasGridTemplateColumns,
          gap: estilosFooter.columnasGap,
        }}
      >
        {contenidoFooter.map((columna, idx) => (
          <div key={idx}>
            <h3
              style={{
                fontSize: estilosFooter.columnaTituloFontSize,
                fontWeight: estilosFooter.columnaTituloFontWeight,
                marginBottom: estilosFooter.columnaTituloMarginBottom,
                color: temaGlobal.primario,
              }}
            >
              {columna.titulo}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {columna.enlaces.map((enlace, i) => (
                <li
                  key={i}
                  onClick={enlace.accion}
                  style={{
                    fontSize: estilosFooter.enlaceFontSize,
                    color: temaGlobal.texto,
                    opacity: estilosFooter.enlaceOpacity,
                    marginBottom: estilosFooter.enlaceMarginBottom,
                    textDecoration: estilosFooter.enlaceTextDecoration,
                    cursor: estilosFooter.enlaceCursor,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = estilosFooter.enlaceHoverOpacity;
                    e.target.style.color = temaGlobal.primario;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = estilosFooter.enlaceOpacity;
                    e.target.style.color = temaGlobal.texto;
                  }}
                >
                  {enlace.texto}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: estilosFooter.copyrightMarginTop,
          paddingTop: "1rem",
          borderTop: `${estilosFooter.borderTopWidth} ${estilosFooter.borderTopStyle} ${temaGlobal.texto}20`,
          textAlign: estilosFooter.copyrightTextAlign,
          fontSize: estilosFooter.copyrightFontSize,
          opacity: estilosFooter.copyrightOpacity,
        }}
      >
        <p style={{ margin: 0 }}>{textosFooter.derechos}</p>
        <p style={{ margin: "0.5rem 0 0" }}>{textosFooter.creador}</p>
      </div>

      {modalActivo && (
        <ModalBase
          isOpen={!!modalActivo}
          onClose={cerrarModal}
          titulo={tituloModalActual()}
        >
          <div
            style={{
              fontSize: estilosModal.bodyFontSize,
              textAlign: estilosModal.bodyTextAlign,
            }}
          >
            {renderContenidoModal()}
          </div>
        </ModalBase>
      )}
    </footer>
  );
};

export default Footer;
