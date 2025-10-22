import React, { useState, useEffect } from "react";
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "./hooks/useAuth";
import { goBack } from './utils/navigation';

import "./EditarPerfil.css";

export default function EditarPerfil() {
  const { user, isAuthenticated } = useAuth();
  
  console.log('EditarPerfil - Componente renderizado');
  console.log('EditarPerfil - isAuthenticated:', isAuthenticated);
  console.log('EditarPerfil - user:', user);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [schedule, setSchedule] = useState("");

  const [serviciosAccesibilidad, setServiciosAccesibilidad] = useState({
    pasillosMin90cm: false,
    rampa: false,
    puerta80cm: false,
    pisosAntideslizantes: false,
    banoAccesible: false,
    mesasSillasAdaptadas: false,
    ascensor: true,
    senalizacionBraille: false,
    contrasteColores: false,
    guiasPodotactiles: false,
    alarmasEmergencia: false,
    sistemaAudifonos: false
  });

  const toggleAccesibilidad = (field) => {
    setServiciosAccesibilidad(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Cargar datos actuales del usuario
  useEffect(() => {
    if (user) {
      console.log('EditarPerfil - Usuario completo:', user);
      console.log('EditarPerfil - Datos de accesibilidad:', user.accesibilidad);
      
      setName(user.nombre || "");
      setDescription(user.descripcion || "Restaurante....");
      setAddress(user.direccion || "Pocitos y...");
      setContact(user.contacto || "+598....");
      setEmail(user.email || "");
      setSchedule(user.horario || user.horarios || "");
      
      // Cargar datos de accesibilidad si existen
      if (user.accesibilidad) {
        console.log('EditarPerfil - Accesibilidad completa del usuario:', user.accesibilidad);
        
        const accesibilidadData = {
          pasillosMin90cm: user.accesibilidad.pasillos || false,
          rampa: user.accesibilidad.ramp || false,
          puerta80cm: user.accesibilidad.puertaAncha || false,
          pisosAntideslizantes: user.accesibilidad.pisosAntideslizantes || false,
          banoAccesible: user.accesibilidad.banoAdaptado || false,
          mesasSillasAdaptadas: user.accesibilidad.mesasSillasAdaptadas || false,
          ascensor: user.accesibilidad.elevator || false,
          senalizacionBraille: user.accesibilidad.braille || false,
          contrasteColores: user.accesibilidad.contrasteColores || false,
          guiasPodotactiles: user.accesibilidad.guiasPodotactiles || false,
          alarmasEmergencia: user.accesibilidad.alarmasEmergencia || false,
          sistemaAudifonos: user.accesibilidad.sistemaAudifonos || false
        };
        
        console.log('EditarPerfil - Datos de accesibilidad mapeados:', accesibilidadData);
        setServiciosAccesibilidad(accesibilidadData);
      } else {
        console.log('EditarPerfil - No hay datos de accesibilidad en el usuario');
        // Mantener los valores por defecto si no hay datos
        setServiciosAccesibilidad({
          pasillosMin90cm: false,
          rampa: false,
          puerta80cm: false,
          pisosAntideslizantes: false,
          banoAccesible: false,
          mesasSillasAdaptadas: false,
          ascensor: true, // Valor por defecto
          senalizacionBraille: false,
          contrasteColores: false,
          guiasPodotactiles: false,
          alarmasEmergencia: false,
          sistemaAudifonos: false
        });
      }
    }
  }, [user]);

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acceso no autorizado</h2>
        <p>Debes iniciar sesión para acceder a esta página.</p>
        <button onClick={() => window.location.hash = '#inicio'}>
          Ir al inicio
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user && (user.empresa_id || user.id)) {
      try {
        const empresaId = user.empresa_id || user.id;
        console.log('EditarPerfil - Actualizando empresa ID:', empresaId);
        
        // Mapear los datos de accesibilidad del frontend a la estructura esperada por el backend
        const accesibilidadParaBackend = {
          pasillos: serviciosAccesibilidad.pasillosMin90cm,
          ramp: serviciosAccesibilidad.rampa,
          puertaAncha: serviciosAccesibilidad.puerta80cm,
          pisosAntideslizantes: serviciosAccesibilidad.pisosAntideslizantes,
          banoAdaptado: serviciosAccesibilidad.banoAccesible,
          mesasSillasAdaptadas: serviciosAccesibilidad.mesasSillasAdaptadas,
          elevator: serviciosAccesibilidad.ascensor,
          braille: serviciosAccesibilidad.senalizacionBraille,
          contrasteColores: serviciosAccesibilidad.contrasteColores,
          guiasPodotactiles: serviciosAccesibilidad.guiasPodotactiles,
          alarmasEmergencia: serviciosAccesibilidad.alarmasEmergencia,
          sistemaAudifonos: serviciosAccesibilidad.sistemaAudifonos
        };

        // Preparar datos para enviar al backend
        const datosPerfil = {
          nombre: name,
          descripcion: description,
          direccion: address,
          contacto: contact,
          email: email,
          horario: schedule,
          accesibilidad: accesibilidadParaBackend
        };

        console.log('EditarPerfil - Datos a enviar:', datosPerfil);
        console.log('EditarPerfil - Accesibilidad a enviar:', accesibilidadParaBackend);
        console.log('EditarPerfil - Estado actual de serviciosAccesibilidad:', serviciosAccesibilidad);

        // Enviar datos al backend
        const response = await fetch(`https://api-savi.anima.edu.uy/api/empresas/${empresaId}/perfil`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosPerfil)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Actualizar localStorage con los datos del servidor
          const updatedUser = {
            ...user,
            nombre: result.empresa.nombre,
            descripcion: result.empresa.descripcion,
            direccion: result.empresa.direccion,
            contacto: result.empresa.contacto,
            email: result.empresa.email,
            horario: result.empresa.horario,
            publicado: result.empresa.publicado,
            accesibilidad: result.empresa.accesibilidad
          };
          
          console.log('EditarPerfil - Usuario actualizado con accesibilidad:', updatedUser);
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Forzar actualización del estado del usuario
          window.dispatchEvent(new Event('storage'));
          
          // Mostrar mensaje de éxito
          alert("¡Cambios guardados exitosamente!");
          
          // Redirigir al perfil con delay para asegurar actualización
          setTimeout(() => {
            window.location.hash = '#perfil';
            // Forzar recarga del componente después de un momento
            setTimeout(() => {
              window.location.reload();
            }, 200);
          }, 100);
        } else {
          throw new Error(result.error || 'Error al actualizar el perfil');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(`Error al guardar los cambios: ${error.message}`);
      }
    } else {
      alert('No se pudo identificar la empresa. Por favor, inicia sesión nuevamente.');
    }
  };

  return (
    <div className="editar-modal-backdrop" onClick={goBack}>
      <div className="editar-modal-card" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="close-x" aria-label="Cerrar" onClick={goBack}>×</button>
        <h1 className="editar-title">Edita tu perfil <span className="lapiz" aria-hidden="true"><FaRegEdit /></span></h1>
        <div className="editar-subtitle">Elige la información sobre tu local</div>

        <form onSubmit={handleSubmit} className="editar-form">
            <div className="field-group">
              <label htmlFor="nombre" className="field-label">Nombre:</label>
              <input
                id="nombre"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa el nombre de tu empresa"
              />
            </div>

            <div className="field-group">
              <label htmlFor="descripcion" className="field-label">Descripción:</label>
              <input
                id="descripcion"
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa una descripción de tu empresa"
              />
            </div>

            <div className="field-group">
              <label htmlFor="direccion" className="field-label">Dirección:</label>
              <input
                id="direccion"
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ingresa tu dirección"
              />
            </div>

            <div className="field-group">
              <label htmlFor="contacto" className="field-label">Teléfono:</label>
              <input
                id="contacto"
                className="input"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ingresa tu número de teléfono"
              />
            </div>

            <div className="field-group">
              <label htmlFor="email" className="field-label">Email:</label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
              />
            </div>

            <div className="field-group">
              <label htmlFor="horario" className="field-label">Horario:</label>
              <input
                id="horario"
                className="input"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Ingresa tu horario de atención"
              />
            </div>

            <div className="accesibilidad">
              <div className="acc-title">Accesibilidad:</div>

              {/* Pasillos de circulación de mínimo 90cm de ancho */}
              <div className="acc-item">
                <label className={`acc-checkbox ${serviciosAccesibilidad.pasillosMin90cm ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={serviciosAccesibilidad.pasillosMin90cm}
                    onChange={() => toggleAccesibilidad('pasillosMin90cm')}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Pasillos de circulación de mínimo 90cm de ancho</span>
                </label>
              </div>

              {/* Rampa */}
              <div className="acc-item">
                <label className={`acc-checkbox ${serviciosAccesibilidad.rampa ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={serviciosAccesibilidad.rampa}
                    onChange={() => toggleAccesibilidad('rampa')}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Rampa</span>
                </label>
              </div>

              {/* Puerta de Min. 80cm de ancho */}
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

              {/* Pisos antideslizantes y sin desniveles bruscos */}
              <div className="acc-item">
                <label className={`acc-checkbox ${serviciosAccesibilidad.pisosAntideslizantes ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={serviciosAccesibilidad.pisosAntideslizantes}
                    onChange={() => toggleAccesibilidad('pisosAntideslizantes')}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Pisos antideslizantes y sin desniveles bruscos</span>
                </label>
              </div>

              {/* Baño accesible con barras de apoyo */}
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

              {/* Mesas y sillas adaptadas para uso con sillas de ruedas */}
              <div className="acc-item">
                <label className={`acc-checkbox ${serviciosAccesibilidad.mesasSillasAdaptadas ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={serviciosAccesibilidad.mesasSillasAdaptadas}
                    onChange={() => toggleAccesibilidad('mesasSillasAdaptadas')}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Mesas y sillas adaptadas para uso con sillas de ruedas</span>
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

              {/* Señalización en braille */}
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

              {/* Contraste de colores entre pisos, paredes y señalización */}
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

              {/* Guías podotáctiles en zonas de circulación */}
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

              {/* Alarmas de emergencia tanto sonoras como visuales */}
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

              {/* Sistema de apoyo para personas con audífonos */}
              <div className="acc-item">
                <label className={`acc-checkbox ${serviciosAccesibilidad.sistemaAudifonos ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={serviciosAccesibilidad.sistemaAudifonos}
                    onChange={() => toggleAccesibilidad('sistemaAudifonos')}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">Sistema de apoyo para personas con audífonos</span>
                </label>
              </div>
            </div>

            <div className="acciones">
              <button type="submit" className="guardar">Guardar cambios</button>
            </div>
        </form>
      </div>
    </div>
  );
}


