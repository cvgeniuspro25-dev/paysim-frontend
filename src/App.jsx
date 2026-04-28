// frontend/src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Activacion from "./pages/Activacion";
import Login from "./pages/Login";
import PagoExito from "./pages/PagoExito";
import PagoCancelado from "./pages/PagoCancelado";
import { cerebroFront, getTemaActivo } from "./config/cerebroFront";

// Componente LandingPage con efecto de scroll al hash
const LandingPage = () => {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.global;

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const elemento = document.getElementById(id);
        if (elemento) {
          elemento.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);
    }
  }, []);

  return (
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
  );
};

function App() {
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.global;

  return (
    <BrowserRouter>
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

      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activar/:token" element={<Activacion />} />
        <Route path="/pago-exito" element={<PagoExito />} />
        <Route path="/pago-cancelado" element={<PagoCancelado />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
