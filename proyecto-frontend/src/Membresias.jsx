import React from "react";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { goBack } from './utils/navigation';
import "./Membresias.css";

export default function Membresias() {
  const seleccionar = (plan) => {
    try { 
      localStorage.setItem("planSeleccionado", plan); 
    } catch {}
    window.location.hash = '#formapago';
  };

  return (
    <div className="membresias-page">
      <section className="membresias-hero">
        <div className="nav-links">
          <button onClick={() => (window.location.hash = '#inicio')}>Inicio</button>
          <button className="btn-secondary" onClick={goBack}>Volver atrás</button>
        </div>
        <h1 className="membresias-title">Opciones de membresía:</h1>
      </section>

      <main className="membresias-main">
        <div className="cards-grid">
          <div className="plan-card basico">
            <div className="plan-icon">
              <div className="icon-circle">
                <span className="icon-minus">−</span>
              </div>
            </div>
            <h3 className="plan-title">Plan básico</h3>
            <p className="plan-subtitle">Hasta 70 empresas</p>
            <div className="plan-price">
              <span className="price-main">90 USD</span>
              <span className="price-period">/mensual</span>
            </div>
            <ul className="plan-description">
              <li>Incluye la certificación S.A.V.I. y la aparición en la plataforma.</li>
              <li>Representa el nivel mínimo de participación.</li>
            </ul>
            <button className="plan-button basico-btn" onClick={() => seleccionar('basico')}>Seleccionar</button>
          </div>

          <div className="plan-card premium">
            <div className="popular-badge">Más popular</div>
            <div className="plan-icon">
              <div className="icon-star">★</div>
            </div>
            <h3 className="plan-title">Plan premium</h3>
            <p className="plan-subtitle">Hasta 100 empresas</p>
            <div className="plan-price">
              <span className="price-main">150 USD</span>
              <span className="price-period">/mensual</span>
            </div>
            <ul className="plan-description">
              <li>Promoción en redes sociales oficiales de S.A.V.I.</li>
              <li>Reportes de accesibilidad y métricas sobre sus locales.</li>
              <li>Priorización en la aparición dentro del buscador de la app.</li>
              <li>Posibilidad de acceder a capacitaciones y asesoramiento en accesibilidad (en niveles más altos).</li>
            </ul>
            <button className="plan-button premium-btn" onClick={() => seleccionar('premium')}>Seleccionar</button>
          </div>

          <div className="plan-card plus">
            <div className="plan-icon">
              <div className="icon-circle">
                <span className="icon-minus">−</span>
              </div>
            </div>
            <h3 className="plan-title">Plan plus</h3>
            <p className="plan-subtitle">Más de 100 empresas</p>
            <div className="plan-price">
              <span className="price-main">200 USD</span>
              <span className="price-period">/mensual</span>
            </div>
            <ul className="plan-description">
              <li>Este plan cuenta con todos los beneficios de los otros multiplicados para las +100 empresas.</li>
            </ul>
            <button className="plan-button plus-btn" onClick={() => seleccionar('plus')}>Seleccionar</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-socials">
          <span><FaInstagram /></span>
          <span><FaLinkedin /></span>
          <span><FaWhatsapp /></span>
          <span><MdMailOutline /></span>
        </div>
        <div className="footer-text">Contacto: 091 222 333 — savi@gmail.com.uy</div>
      </footer>
    </div>
  );
}


