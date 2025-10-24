import React, { useState } from 'react';
import './RegistroEmpresa.css';
import { FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { MdMailOutline } from 'react-icons/md';
import { goBack } from './utils/navigation';


// Este componente es el formulario para registrar empresas. Mantengo la lógica,
// solo agrego comentarios para que se entienda qué hace cada cosa.
export default function RegistroEmpresa({ onBack }) {
  const [form, setForm] = useState({ name: '', email: '', pass: '', pass2: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para servicios de accesibilidad - basado en la imagen
  const [serviciosAccesibilidad, setServiciosAccesibilidad] = useState({
    pasillosMin90cm: false,
    rampa: false,
    puerta80cm: false,
    pisosAntideslizantes: false,
    banoAccesible: false,
    mesasSillasAdaptadas: false,
    ascensor: true, // Por defecto marcado como en la imagen
    senalizacionBraille: false,
    contrasteColores: false,
    guiasPodotactiles: false,
    alarmasEmergencia: false,
    sistemaAudifonos: false
  });

  // Campos adicionales para servicios específicos
  const [detallesAccesibilidad, setDetallesAccesibilidad] = useState({
    banoAdaptadoCantidad: '',
    banoAdaptadoDetalles: '',
    atencionPrioritariaTipo: '',
    atencionPrioritariaHorario: '',
    otrosServicios: ''
  });

  // handle: actualiza los campos del formulario (name, email, pass, ...)
  const handle = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // toggle: cambia el valor de los checks de accesibilidad
  const toggleAccesibilidad = (servicio) => {
    setServiciosAccesibilidad(prev => ({
      ...prev,
      [servicio]: !prev[servicio]
    }));
  };

  // Actualizar detalles específicos de accesibilidad
  const handleDetallesAccesibilidad = (field, value) => {
    setDetallesAccesibilidad(prev => ({ ...prev, [field]: value }));
  };

  // submit: validación y envío completo con datos de accesibilidad
  const submit = async (e) => {
    e.preventDefault();
    setMsg('');

    // Validación básica
    if (!form.name || !form.email || !form.pass || !form.pass2) {
      setMsg('Todos los campos son obligatorios');
      return;
    }

    if (form.pass !== form.pass2) {
      setMsg('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos completos para enviar al backend
      const datosEmpresa = {
        // Datos básicos de la empresa
        nombre: form.name,
        email: form.email,
        password: form.pass,

        // Datos de accesibilidad
        serviciosAccesibilidad,
        detallesAccesibilidad
      };

      console.log('Datos completos a enviar:', datosEmpresa);

      // Llamada real al backend
      const response = await fetch('http://localhost:3001/api/empresas/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(datosEmpresa)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar la empresa');
      }

      setLoading(false);
      setMsg('¡Empresa registrada exitosamente!');
      console.log('Empresa registrada:', result);
      
      // Guardar información del usuario en localStorage
      if (result.token && result.empresa) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify({
          ...result.empresa,
          tipo: 'empresa',
          id: result.empresa.empresa_id
        }));
      }
      
      // Redirigir a la página de membresías
      setTimeout(() => {
        window.location.hash = '#membresias';
      }, 2000);

    } catch (error) {
      setLoading(false);
      setMsg('Error al registrar la empresa');
      console.error('Error:', error);
    }
  };

  return (
    <div className="perfil-emp-page">
      {/* Header con nav y título */}
      <header className="pe-hero">
        <div className="nav-links">
          <button onClick={() => (window.location.hash = '#inicio')}>Inicio</button>
          <button className="btn-secondary" onClick={goBack}>Volver atrás</button>
        </div>
        <img
          className="pe-hero-img"
          src="https://i.imgur.com/9bmoDHn.png"
          alt="Bienvenida"
        />
        <h1 className="pe-title">Registra tu empresa en SAVI</h1>
      </header>

      <div className="pe-subtitle">Te pedimos que completes los siguientes campos para poder iniciarte en SAVI</div>

      <main className="pe-main">
        {/* Formulario principal para datos de la empresa */}
        <form className="pe-card form" onSubmit={submit}>
          <label>Nombre de la empresa</label>
          <input className="pe-input" placeholder="" value={form.name} name="name" onChange={e => handle('name', e.target.value)} />

          <label>Email</label>
          <input className="pe-input" placeholder="ejemplo@gmail.com" value={form.email} name="email" onChange={e => handle('email', e.target.value)} />

          <label>Contraseña</label>
          <input className="pe-input" type="password" value={form.pass} name="pass" onChange={e => handle('pass', e.target.value)} />

          <label>Confirmar contraseña</label>
          <input className="pe-input" type="password" value={form.pass2} name="pass2" onChange={e => handle('pass2', e.target.value)} />

          {/* Botón de envío y notas de ayuda */}
          <button className="pe-submit" type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Ingresar'}</button>
        </form>

        {/* Sección de servicios de accesibilidad - basada en la imagen */}
        <section className="pe-card acc">
          <h2>¿Qué servicios de accesibilidad ofrecen?</h2>

          {/*Accesibilidad física - Pasillos min 90cm */}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.pasillosMin90cm ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.pasillosMin90cm}
                onChange={() => toggleAccesibilidad('pasillosMin90cm')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Pasillos Min. 90cm</span>
            </label>
          </div>

          {/* Rampa accesible */}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.rampa ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.rampa}
                onChange={() => toggleAccesibilidad('rampa')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Rampa con pendiente adecuada</span>
            </label>
          </div>

          {/* Puerta con 80cm de ancho */}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.puerta80cm ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.puerta80cm}
                onChange={() => toggleAccesibilidad('puerta80cm')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Puerta de Min. 80cm de ancho</span>
            </label>
          </div>

          {/*  Pisos antideslizantes y sin desniveles bruscos. */}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.pisosAntideslizantes ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.pisosAntideslizantes}
                onChange={() => toggleAccesibilidad('pisosAntideslizantes')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Pisos antideslizantes y sin desniveles bruscos.</span>
            </label>
          </div>

          {/*  Baño accesible con barras de apoyo. */}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.banoAccesible ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.banoAccesible}
                onChange={() => toggleAccesibilidad('banoAccesible')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Baño accesible con barras de apoyo</span>
            </label>
          </div>

          {/* Mesas y sillas adaptadas para uso con sillas de ruedas*/}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.mesasSillasAdaptadas ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.mesasSillasAdaptadas}
                onChange={() => toggleAccesibilidad('mesasSillasAdaptadas')}
              />
              <span className="checkmark"></span>
              <span className="label-text"> Mesas y sillas adaptadas para uso con sillas de ruedas</span>
            </label>
          </div>

          {/* Ascensor */}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.ascensor ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.ascensor}
                onChange={() => toggleAccesibilidad('ascensor')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Ascensor</span>
            </label>
          </div>

          <br>
          </br>
          <br>
          </br>
          {/* Sección de adaptabilidad accesible - Señalización en braille*/}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.senalizacionBraille ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.senalizacionBraille}
                onChange={() => toggleAccesibilidad('senalizacionBraille')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Señalización en braille</span>
            </label>
          </div>

          {/*Contraste de colores entre pisos, paredes y señalización*/}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.contrasteColores ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.contrasteColores}
                onChange={() => toggleAccesibilidad('contrasteColores')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Contraste de colores entre pisos, paredes y señalización</span>
            </label>
          </div>

          {/*Guías podotáctiles en zonas de circulación*/}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.guiasPodotactiles ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.guiasPodotactiles}
                onChange={() => toggleAccesibilidad('guiasPodotactiles')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Guías podotáctiles en zonas de circulación</span>
            </label>
          </div>


          {/*Alarmas de emergencia tanto sonoras como visuales*/}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.alarmasEmergencia ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.alarmasEmergencia}
                onChange={() => toggleAccesibilidad('alarmasEmergencia')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Alarmas de emergencia tanto sonoras como visuales</span>
            </label>
          </div>


          {/*Sistema de apoyo para personas con audifonos*/}
          <div className="acc-item">
            <label className={`acc-checkbox ${serviciosAccesibilidad.sistemaAudifonos ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={serviciosAccesibilidad.sistemaAudifonos}
                onChange={() => toggleAccesibilidad('sistemaAudifonos')}
              />
              <span className="checkmark"></span>
              <span className="label-text">Sistema de apoyo para personas con audifonos</span>
            </label>
          </div>




        </section>
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
