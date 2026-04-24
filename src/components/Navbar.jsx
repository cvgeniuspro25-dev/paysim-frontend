// frontend/src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cerebroFront, getTemaActivo } from "../config/cerebroFront";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const temaActivo = getTemaActivo();
  const estilos = cerebroFront.estilos.navbar;
  const textos = cerebroFront.textos;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: textos.nav.funcionalidades, href: "#funcionalidades" },
    { name: textos.nav.timeline, href: "#timeline" },
    { name: textos.nav.planes, href: "#planes" },
    { name: textos.nav.info, href: "#info-modos" },
    { name: textos.nav.testimonios, href: "#testimonios" },
    { name: textos.nav.faq, href: "#faq" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: estilos.motionInitialY }}
      animate={{ y: estilos.motionAnimateY }}
      transition={{ duration: estilos.motionTransitionDuration }}
      style={{
        position: estilos.position,
        top: estilos.top,
        left: estilos.left,
        right: estilos.right,
        zIndex: estilos.zIndex,
        backgroundColor: scrolled
          ? `${temaActivo.fondo}${Math.round(
              estilos.backgroundColorScrolledOpacity * 255,
            )
              .toString(16)
              .padStart(2, "0")}`
          : estilos.backgroundColorTransparent,
        backdropFilter: estilos.backdropFilterAlways,
        boxShadow: scrolled ? estilos.boxShadowScrolled : estilos.navBoxShadow,
        border: estilos.navBorder,
        outline: estilos.outline,
        padding: estilos.padding,
        transition: estilos.transitionAll,
      }}
    >
      <div
        style={{
          maxWidth: estilos.maxWidth,
          margin: estilos.margin,
          display: estilos.display,
          justifyContent: estilos.justifyContent,
          alignItems: estilos.alignItems,
        }}
      >
        <motion.a
          href="#inicio"
          onClick={(e) => handleNavClick(e, "#inicio")}
          style={{
            fontSize: estilos.logoFontSize,
            fontWeight: estilos.logoFontWeight,
            color: temaActivo.primario,
            textDecoration: estilos.logoTextDecoration,
          }}
          whileHover={{ scale: estilos.logoScaleHover }}
        >
          {textos.logo}
        </motion.a>

        <ul
          style={{
            display: estilos.navMenuDisplay,
            gap: estilos.navMenuGap,
            listStyle: estilos.navMenuListStyle,
            margin: estilos.navMenuMargin,
            padding: estilos.navMenuPadding,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: temaActivo.texto,
                  textDecoration: estilos.linkTextDecoration,
                  fontSize: estilos.linkFontSize,
                  fontWeight: estilos.linkFontWeight,
                  transition: estilos.linkTransition,
                  border: estilos.linkBorder,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = temaActivo.primario)
                }
                onMouseLeave={(e) => (e.target.style.color = temaActivo.texto)}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div
          style={{ display: estilos.buttonDisplay, gap: estilos.buttonGap }}
          className="desktop-nav"
        >
          <motion.button
            whileHover={{ scale: estilos.buttonScaleHover }}
            whileTap={{ scale: estilos.buttonScaleTap }}
            style={{
              padding: estilos.buttonPadding,
              borderRadius: estilos.buttonBorderRadius,
              border: estilos.buttonBorder,
              backgroundColor: estilos.buttonBackgroundTransparent,
              color: temaActivo.primario,
              fontWeight: estilos.buttonFontWeight,
              cursor: estilos.buttonCursor,
              transition: estilos.transitionAll,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = temaActivo.primario;
              e.target.style.color = temaActivo.textoInverso;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor =
                estilos.buttonBackgroundTransparent;
              e.target.style.color = temaActivo.primario;
            }}
          >
            {textos.botones.ingresar}
          </motion.button>
          <motion.button
            whileHover={{ scale: estilos.buttonScaleHover }}
            whileTap={{ scale: estilos.buttonScaleTap }}
            style={{
              padding: estilos.buttonPadding,
              borderRadius: estilos.buttonBorderRadius,
              border: estilos.buttonBorder,
              backgroundColor: temaActivo.secundario,
              color: temaActivo.textoInverso,
              fontWeight: estilos.buttonFontWeight,
              cursor: estilos.buttonCursor,
              transition: estilos.transitionAll,
            }}
          >
            {textos.botones.registrarse}
          </motion.button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: estilos.mobileMenuButtonDisplayNone,
            background: estilos.mobileMenuBackground,
            border: estilos.mobileMenuBorder,
            cursor: estilos.mobileMenuCursor,
          }}
          className="mobile-menu-btn"
        >
          <svg
            width={estilos.iconWidth}
            height={estilos.iconHeight}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d={
                mobileOpen ? "M18 6L6 18M6 6L18 18" : "M4 6H20M4 12H20M4 18H20"
              }
              stroke={temaActivo.texto}
              strokeWidth={estilos.iconStrokeWidth}
              strokeLinecap={estilos.iconStrokeLinecap}
            />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: estilos.mobileMenuContainerPosition,
            top: estilos.mobileMenuContainerTop,
            left: estilos.mobileMenuContainerLeft,
            right: estilos.mobileMenuContainerRight,
            backgroundColor: temaActivo.fondo,
            boxShadow: estilos.boxShadowMobile,
            padding: estilos.mobileMenuPadding,
            display: estilos.mobileMenuContainerDisplay,
            flexDirection: estilos.mobileMenuContainerFlexDirection,
            gap: estilos.mobileMenuContainerGap,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                color: temaActivo.texto,
                textDecoration: estilos.linkTextDecoration,
                fontSize: estilos.mobileLinkFontSize,
                padding: estilos.mobileLinkPadding,
              }}
            >
              {link.name}
            </a>
          ))}
          <div
            style={{
              display: estilos.buttonDisplay,
              gap: estilos.buttonGap,
              marginTop: estilos.marginTop1rem,
            }}
          >
            <button
              style={{
                flex: estilos.flexOne,
                padding: estilos.mobileButtonPadding,
                borderRadius: estilos.buttonBorderRadius,
                border: estilos.buttonBorder,
                backgroundColor: estilos.buttonBackgroundTransparent,
                color: temaActivo.primario,
                fontWeight: estilos.buttonFontWeight,
              }}
            >
              {textos.botones.ingresar}
            </button>
            <button
              style={{
                flex: estilos.flexOne,
                padding: estilos.mobileButtonPadding,
                borderRadius: estilos.buttonBorderRadius,
                border: estilos.buttonBorder,
                backgroundColor: temaActivo.secundario,
                color: temaActivo.textoInverso,
                fontWeight: estilos.buttonFontWeight,
              }}
            >
              {textos.botones.registrarse}
            </button>
          </div>
        </motion.div>
      )}

      <style jsx="true">{`
        @media (max-width: ${cerebroFront.breakpoints.tablet}) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: ${estilos.mobileMenuButtonDisplayBlock} !important;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
