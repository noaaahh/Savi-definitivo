// Utilidades de navegación para la aplicación

/**
 * Función para navegar hacia atrás en el historial del navegador
 * Si no hay historial, redirige a la página de inicio
 */
export const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.hash = '#inicio'; // Fallback to home
  }
};

/**
 * Función para navegar a una página específica usando hash
 * @param {string} page - La página a la que navegar (ej: 'inicio', 'registro', etc.)
 */
export const navigateTo = (page) => {
  window.location.hash = `#${page}`;
};

/**
 * Función para navegar a la página de inicio
 */
export const goHome = () => {
  window.location.hash = '#inicio';
};
