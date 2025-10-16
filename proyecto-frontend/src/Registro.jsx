import React from 'react';
import './registro.css';
import { goBack } from './utils/navigation';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

// Componente `Registro`
// - Props:
//   onBack: función que te devuelve a la pantalla anterior
//   onGoRegistroPersonal: función para ir al formulario de usuario
//   onGoRegistroEmpresa: función para ir al formulario de empresa
// Este componente sólo muestra las opciones de registro (no hace lógica de envío).
export default function Registro({ onBack, onGoRegistroPersonal, onGoRegistroEmpresa }) {
  return (
    <div className="registro">
      <section className="registro__hero">
        <nav className="registro__nav">
          <button className="registro__btn" onClick={goBack}>Volver</button>
          <button className="registro__btn registro__btn--primary" onClick={onBack}>Inicio</button>
        </nav>
        <img
          className="registro__hero-img"
          src="https://i.imgur.com/XhHkOp3.png"
          alt="Piso táctil accesibilidad"
        />
        <h1 className="registro__hero-title">¡Unite a nuestra comunidad!!</h1>
      </section>

      <section className="registro__selector">
        <div className="registro__selector-intro">
          <h2>Selecciona el tipo de registro que se ajuste a tu perfil.</h2>
          <div className="registro__hand" aria-hidden="true">
            <img src="https://i.imgur.com/5NTE4aI.png" alt="Accesibilidad" />
          </div>
        </div>

        <div className="registro__selector-options">
          {/* Botón: cuando lo apretás, vas al registro personal */}
          <button className="registro__option" onClick={onGoRegistroPersonal}>
            <span className="registro__option-label">
              <span className="registro__option-title">Registro personal</span>
              <span className="registro__option-subtitle">Registrate y empeza a calificar tus lugares favoritos.</span>
            </span>
            <span className="registro__option-right">
              <span className="registro__dot" />
            </span>
          </button>

          {/* Botón: cuando lo apretás, vas al registro de empresa */}
          <button className="registro__option" onClick={onGoRegistroEmpresa}>
            <span className="registro__option-label">
              <span className="registro__option-title">Registro empresarial</span>
              <span className="registro__option-subtitle">Registra tu empresa y sé parte de SAVI.</span>
            </span>
            <span className="registro__option-right">
              <span className="registro__dot" />
            </span>
          </button>
        </div>
      </section>

      <footer className="registro__footer">
        <div className="registro__footer-left">
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
        </div>
        <div className="registro__footer-right">Contacto: 091 222 333 — savi@gmail.com.uy</div>
      </footer>
    </div>
  );
}
