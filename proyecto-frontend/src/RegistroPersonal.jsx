import React, { useState } from 'react';
import './RegistroPersonal.css';
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { goBack } from './utils/navigation';

export default function RegistroPersonal({ onBack, onGoInicio, onGoInicioUsuario }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas
    if (!form.nombre || !form.email || !form.password || !form.password2) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // Enviar datos al backend
      const response = await fetch('http://api-savi.anima.edu.uy/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.nombre,
          email: form.email,
          password: form.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar el usuario');
      }

      setLoading(false);
      console.log('Usuario registrado:', result);
    
      // Redirigir al usuario después de 2 segundos
      setTimeout(() => {
        if (onGoInicioUsuario) onGoInicioUsuario();
        else window.location.hash = '#inicioUsuario';
      }, 2000);

    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error al registrar el usuario');
      setMsg('');
      console.error('Error:', error);
    }
  };

  return (
    <div className="registroPersonal">
      <section className="registroPersonal__hero">
        <nav className="registroPersonal__nav">
          <button className="registroPersonal__btn registroPersonal__btn--primary" onClick={onGoInicio}>Inicio</button>
          <button className="registroPersonal__btn" onClick={goBack}>Volver atrás</button>
        </nav>
        <img
          className="registroPersonal__hero-img"
          src="https://i.imgur.com/S23StlD.png"
          alt="Cocina registro SAVI"
        />
        <h1 className="registroPersonal__title">Registrate en SAVI</h1>
      </section>

      <div className="registroPersonal__intro">Te pedimos que completes los siguientes campos para poder disfrutar de SAVI</div>

      <section className="registroPersonal__form-wrapper">
        {(error || msg) && (
          <div className="error-message" style={{ 
            color: error && !error.includes('exitosamente') ? 'red' : 'green', 
            marginBottom: '20px', 
            textAlign: 'center' 
          }}>
            {error || msg}
          </div>
        )}

        <form className="registroPersonal__form" onSubmit={submit}>
          <label className="registroPersonal__label" htmlFor="rp-nombre">Nombre</label>
          <input
            id="rp-nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
          />

          <label className="registroPersonal__label" htmlFor="rp-email">Email</label>
          <input
            id="rp-email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ejemplo@gmail.com"
          />

          <label className="registroPersonal__label" htmlFor="rp-password">Contraseña</label>
          <input
            id="rp-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <label className="registroPersonal__label" htmlFor="rp-password2">Confirmar contraseña</label>
          <input
            id="rp-password2"
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
          />

          <button type="submit" className="registroPersonal__submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Ingresar'}
          </button>
        </form>
      </section>

      <footer className="registroPersonal__footer">
        <div className="registroPersonal__footer-left">
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
          <a href="#" aria-label="Email"><MdMailOutline /></a>
        </div>
        <div className="registroPersonal__footer-right">
          <span>Contacto: 091 222 333 — savi@gmail.com.uy</span>
        </div>
      </footer>
    </div>
  );
}
