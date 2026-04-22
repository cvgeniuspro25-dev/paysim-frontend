// frontend/src/config/cerebroFront.js
// 🧠 CEREBRO DEL FRONTEND - CONFIGURACIÓN GLOBAL (ESPEJO DEL BACKEND)
// Cualquier cambio aquí se refleja en toda la interfaz visual

export const cerebroFront = {
  // ==========================================
  // SECCIÓN 1: TEMAS Y COLORES (Modo Claro/Oscuro)
  // ==========================================
  tema: {
    claro: {
      fondo: "#FFFFFF",
      texto: "#1A1A1A",
      primario: "#009EE3",      // Azul Mercado Pago
      secundario: "#FF6B00",    // Naranja
      exito: "#00A650",         // Verde
      error: "#F23D4F",         // Rojo
      advertencia: "#FFC107",   // Amarillo
      info: "#3483FA",          // Azul claro
    },
    oscuro: {
      fondo: "#121212",
      texto: "#E0E0E0",
      primario: "#009EE3",
      secundario: "#FF8C42",
      exito: "#00C853",
      error: "#FF5A5F",
      advertencia: "#FFCA28",
      info: "#5C9EFF",
    },
    activo: "claro", // Tema por defecto
  },

  // ==========================================
  // SECCIÓN 2: PLANES DE SUSCRIPCIÓN
  // ==========================================
  planes: {
    free: {
      nombre: "Free",
      precioMensual: 0,
      tokensIniciales: 100,
      permiteEmpleados: false,
      maxEmpleados: 0,
      permiteCompraTokens: true,
      permitePagoPorConsumo: true,
    },
    starter: {
      nombre: "Starter",
      precioMensual: 15,
      tokensMensuales: 500,
      permiteEmpleados: false,
      maxEmpleados: 0,
      permiteCompraTokens: true,
      permitePagoPorConsumo: true,
    },
    pro: {
      nombre: "Pro",
      precioMensual: 45,
      tokensMensuales: 2000,
      permiteEmpleados: true,
      maxEmpleados: 3,
      permiteCompraTokens: true,
      permitePagoPorConsumo: true,
      precioEmpleadoExtra: 10,
    },
    enterprise: {
      nombre: "Enterprise",
      precioMensual: 150,
      tokensMensuales: 20000,
      permiteEmpleados: true,
      maxEmpleados: 20,
      permiteCompraTokens: true,
      permitePagoPorConsumo: true,
      precioEmpleadoExtra: 8,
    },
    payAsYouGo: {
      nombre: "Pago por Consumo",
      precioMensual: 0,
      tokensMensuales: 0,
      requiereTarjetaValidada: true,
      facturacionMensual: true,
    },
  },

  // ==========================================
  // SECCIÓN 3: PAQUETES DE TOKENS
  // ==========================================
  paquetesTokens: [
    { cantidad: 100, precio: 5, descuento: 0 },
    { cantidad: 500, precio: 22.5, descuento: 10 },
    { cantidad: 1000, precio: 40, descuento: 20 },
    { cantidad: 5000, precio: 175, descuento: 30 },
  ],

  // ==========================================
  // SECCIÓN 4: EQUIVALENCIAS Y CÁLCULOS
  // ==========================================
  equivalencias: {
    tokenAPesos: 5000,
    monedasSoportadas: ["ARS", "USD"],
    dolarAPesos: 1000,
  },

  // ==========================================
  // SECCIÓN 5: CONSUMOS DE TOKENS
  // ==========================================
  consumos: {
    crearAplicacion: 2,
    crearTarjetaTester: 1,
    renovarTarjetaRobadaPerdida: 0,
    reemplazarTarjetaBloqueada: 1,
  },

  // ==========================================
  // SECCIÓN 6: LÍMITES Y SEGURIDAD
  // ==========================================
  limites: {
    maxAplicacionesFree: 2,
    maxAplicacionesStarter: 10,
    maxAplicacionesPro: 50,
    maxAplicacionesEnterprise: 200,
    maxTarjetasPorAplicacion: 8,
    longitudMinimaPassword: 8,
    intentosMaximosLogin: 5,
    tiempoBloqueoLogin: 15 * 60 * 1000,
  },

  // ==========================================
  // SECCIÓN 7: PLANTILLAS DE CORREO (Solo referencias para el frontend)
  // ==========================================
  plantillasEmail: {
    bienvenida: {
      asunto: "¡Bienvenido a PaySim!",
    },
    resumenMensual: {
      asunto: "Tu resumen mensual de PaySim",
    },
  },

  // ==========================================
  // SECCIÓN 8: DISEÑOS DE MODALES
  // ==========================================
  modales: {
    exito: {
      clase: "modal-exito",
      icono: "✅",
      colorFondo: "#00A650",
    },
    error: {
      clase: "modal-error",
      icono: "❌",
      colorFondo: "#F23D4F",
    },
    advertencia: {
      clase: "modal-advertencia",
      icono: "⚠️",
      colorFondo: "#FFC107",
    },
    info: {
      clase: "modal-info",
      icono: "ℹ️",
      colorFondo: "#3483FA",
    },
  },

  // ==========================================
  // SECCIÓN 9: CONFIGURACIÓN DE RESPONSIVIDAD
  // ==========================================
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1440px",
  },

  // ==========================================
  // SECCIÓN 10: URLS Y ENDPOINTS (SIN HARDCODEAR)
  // ==========================================
  urls: {
    backendLocal: "http://192.168.10.12:5000",
    backendProduccion: "https://paysim-backend-production.up.railway.app",
    frontendLocal: "http://192.168.10.12:5180",
  },
};

// Función helper para obtener el tema activo
export const getTemaActivo = () => {
  return cerebroFront.tema[cerebroFront.tema.activo];
};

export default cerebroFront;