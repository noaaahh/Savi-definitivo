import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './NavigationBar.css';

const NavigationBar = ({ leftButtons = [] }) => {
  const { isAuthenticated } = useAuth();

  // Filtrar botones según el estado de autenticación
  const filteredButtons = leftButtons.filter(button => {
    // Si el botón es "Iniciar sesión" o "Registrarse" y el usuario ya está autenticado, no mostrarlo
    if ((button.label === 'Iniciar sesión' || button.label === 'Registrarse') && isAuthenticated) {
      return false;
    }
    return true;
  });

  return (
    <div className="navigation-bar">
      <div className="navigation-content">
        {/* Solo botones izquierdos */}
        <div className="navigation-buttons">
          <div className="navigation-left">
            {filteredButtons.map((button, index) => (
              <button
                key={index}
                className={`nav-button ${button.primary ? 'nav-button--primary' : 'nav-button--secondary'}`}
                onClick={button.onClick}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
