// frontend/src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Funcionalidades from "./components/Funcionalidades";
import Timeline from "./components/Timeline";
import Planes from "./components/Planes";
import InfoModos from "./components/InfoModos";
import Testimonios from "./components/Testimonios";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import { cerebroFront, getTemaActivo } from "./config/cerebroFront";

function App() {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.global;
  const path = window.location.pathname;

  return (
    <>
      <style>{`
        * {
          box-sizing: ${estilos.boxSizing};
        }
        html, body, #root {
          margin: ${estilos.htmlBodyRootMargin};
          padding: ${estilos.htmlBodyRootPadding};
          width: ${estilos.htmlBodyRootWidth};
          min-height: ${estilos.htmlBodyRootMinHeight};
          background-color: ${temaActivo.fondo};
          border: ${estilos.htmlBodyRootBorder};
          outline: ${estilos.htmlBodyRootOutline};
          box-shadow: ${estilos.htmlBodyRootBoxShadow};
        }
        body {
          background-color: ${temaActivo.fondo};
        }
      `}</style>

      {path === "/registro" ? (
        <Registro />
      ) : path === "/login" ? (
        <Login />
      ) : (
        <div
          style={{
            backgroundColor: temaActivo.fondo,
            color: temaActivo.texto,
            minHeight: estilos.appContainerMinHeight,
            fontFamily: estilos.appContainerFontFamily,
            margin: estilos.appContainerMargin,
            padding: estilos.appContainerPadding,
            border: estilos.appContainerBorder,
            outline: estilos.appContainerOutline,
            boxShadow: estilos.appContainerBoxShadow,
          }}
        >
          <Navbar />
          <Hero />
          <Funcionalidades />
          <Timeline />
          <Planes />
          <InfoModos />
          <Testimonios />
          <Faq />
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
