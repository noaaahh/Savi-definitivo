// Utilidad para navegación del navegador
export const goBack = () => {
  // Verificar si hay historial disponible
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Si no hay historial, ir al inicio
    window.location.hash = '#inicio';
  }
};

// Función alternativa que siempre va al inicio si no hay historial
export const goBackOrHome = () => {
  try {
    window.history.back();
  } catch (error) {
    // Fallback al inicio si hay algún error
    window.location.hash = '#inicio';
  }
};
