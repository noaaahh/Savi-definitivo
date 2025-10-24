import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './LoginStatus.css';

const LoginStatus = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('LoginStatus - Render:', { isAuthenticated, user });

  if (!isAuthenticated || !user) {
    console.log('LoginStatus - Not authenticated, returning null');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('authChange'));
    window.location.hash = '#inicio';
  };

  const handleGoToProfile = () => {
    window.location.hash = '#perfil';
  };

  const getUserDisplayName = () => {
    if (user.tipo === 'empresa') {
      return user.nombre || user.email;
    } else {
      return user.nombre || user.email;
    }
  };

  const getUserTypeLabel = () => {
    return user.tipo === 'empresa' ? 'Empresa' : 'Usuario';
  };

  return (
    <div className="login-status">
      <div className="login-info">
        <span className="user-type">{getUserTypeLabel()}:</span>
        <span className="user-name">{getUserDisplayName()}</span>
      </div>
      <div className="login-actions">
        {user.tipo === 'empresa' && (
          <button 
            className="profile-btn" 
            onClick={handleGoToProfile}
            title="Ir a mi perfil"
          >
            Ir a mi perfil
          </button>
        )}
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default LoginStatus;
