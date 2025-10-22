import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { buildApiUrl } from "./config/api";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaRegEdit } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import ImageUpload from "./components/ImageUpload";
import "./Perfil.css";
import { goBack } from './utils/navigation';

export default function Perfil({ onEditPerfil }) {
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.tipo === 'empresa') {
      // Siempre cargar datos completos desde la API para asegurar datos actualizados
      cargarDatosEmpresa();
    } else {
      setLoading(false);
    }
  }, [user]);

  const cargarDatosEmpresa = async () => {
    try {
      const empresaId = user.empresa_id || user.id;
      
      const response = await fetch(buildApiUrl(`api/empresas/${empresaId}`));
      const data = await response.json();
      
      if (data.success) {
        console.log('Datos de empresa recibidos:', data.empresa);
        console.log('Accesibilidad recibida:', data.empresa.accesibilidad);
        console.log('Tipo de accesibilidad:', typeof data.empresa.accesibilidad);
        console.log('Es objeto accesibilidad?', typeof data.empresa.accesibilidad === 'object');
        console.log('Imágenes recibidas:', data.empresa.imagenes);
        setEmpresa(data.empresa);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-page">
      <section className="perfil-hero">
        <div className="nav-links">
          <button onClick={() => (window.location.hash = '#inicio')}>Inicio</button>
          <button className="btn-secondary" onClick={() => (window.location.hash = '#inicio')}>Ver perfiles</button>
        </div>
        <h1 className="perfil-title">
          {empresa ? empresa.nombre : 'Mi Perfil'} <span className="lapiz" aria-hidden="true"><FaRegEdit /></span>
        </h1>
      </section>

      <main className="perfil-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
            Cargando datos...
          </div>
        ) : empresa ? (
          <div className="perfil-info" style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '10px', 
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#333' }}>Información de la Empresa</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => (window.location.hash = '#membresias')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0a7bdc',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f0f8ff'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Membresía
                </button>
                <button 
                  onClick={onEditPerfil}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0a7bdc',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f0f8ff'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Editar perfil
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <strong style={{ color: '#666' }}>Nombre:</strong>
                <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{empresa.nombre || 'No especificado'}</p>
              </div>

              <div>
                <strong style={{ color: '#666' }}>Descripción:</strong>
                <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{empresa.descripcion || 'No hay descripción disponible.'}</p>
              </div>

              <div>
                <strong style={{ color: '#666' }}>Dirección:</strong>
                <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{empresa.direccion || empresa.direccionPostal || 'No especificado'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <strong style={{ color: '#666' }}>Teléfono:</strong>
                  <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{empresa.contacto || empresa.telefono || 'No especificado'}</p>
                </div>
                <div>
                  <strong style={{ color: '#666' }}>Email:</strong>
                  <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{empresa.email || 'No especificado'}</p>
                </div>
              </div>

              <div>
                <strong style={{ color: '#666' }}>Horario:</strong>
                <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>{empresa.horario || empresa.horarios || 'No disponible'}</p>
              </div>

              <div>
                <strong style={{ color: '#666' }}>Accesibilidad:</strong>
                <div style={{ marginTop: '10px' }}>
                  {(() => {
                    console.log('Renderizando accesibilidad:', empresa.accesibilidad);
                    console.log('Condición 1 (empresa.accesibilidad):', !!empresa.accesibilidad);
                    console.log('Condición 2 (typeof === object):', typeof empresa.accesibilidad === 'object');
                    return empresa.accesibilidad && typeof empresa.accesibilidad === 'object';
                  })() ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {empresa.accesibilidad.pasillos && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Pasillos min 90cm</span>
                      )}
                      {empresa.accesibilidad.ramp && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Rampa</span>
                      )}
                      {empresa.accesibilidad.banoAdaptado && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Baño adaptado</span>
                      )}
                      {empresa.accesibilidad.braille && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Braille</span>
                      )}
                      {empresa.accesibilidad.pisosAntideslizantes && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Pisos antideslizantes</span>
                      )}
                      {empresa.accesibilidad.mesasSillasAdaptadas && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Mesas y sillas adaptadas</span>
                      )}
                      {empresa.accesibilidad.elevator && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Ascensor</span>
                      )}
                      {empresa.accesibilidad.puertaAncha && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Puerta ancha</span>
                      )}
                      {empresa.accesibilidad.contrasteColores && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Contraste de colores</span>
                      )}
                      {empresa.accesibilidad.guiasPodotactiles && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Guías podotáctiles</span>
                      )}
                      {empresa.accesibilidad.alarmasEmergencia && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Alarmas de emergencia</span>
                      )}
                      {empresa.accesibilidad.sistemaAudifonos && (
                        <span style={{ 
                          backgroundColor: '#0a7bdc', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '14px' 
                        }}>✓ Sistema de audífonos</span>
                      )}
                    </div>
                  ) : (
                    <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>Sin información de accesibilidad</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="perfil-info" style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '10px', 
            marginBottom: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ marginBottom: '12px', color: '#333' }}>Perfil vacío</h2>
            <p style={{ color: '#333', lineHeight: 1.5 }}>
              Aún no hay información de la empresa disponible. Puedes completar los datos desde "Editar perfil".
              <br />
              Ejemplo de información que puedes agregar: descripción del local, dirección, teléfono, email y horario de atención.
            </p>
          </div>
        )}

        {empresa && (
          <ImageUpload 
            empresaId={empresa.empresa_id || empresa.id}
            existingImages={(() => {
              try {
                if (!empresa.imagenes || empresa.imagenes === 'null' || empresa.imagenes.trim() === '') {
                  return [];
                }
                return JSON.parse(empresa.imagenes);
              } catch (error) {
                console.error('Error parsing imagenes:', error, 'Value:', empresa.imagenes);
                return [];
              }
            })()}
            onImagesUploaded={(newImages) => {
              // Asegurar que newImages sea un array
              const newImagesArray = Array.isArray(newImages) ? newImages : [];
              
              // Actualizar el estado local con las nuevas imágenes
              const existingImages = (() => {
                try {
                  if (!empresa.imagenes || empresa.imagenes === 'null' || empresa.imagenes.trim() === '') {
                    return [];
                  }
                  return JSON.parse(empresa.imagenes);
                } catch (error) {
                  console.error('Error parsing imagenes:', error, 'Value:', empresa.imagenes);
                  return [];
                }
              })();
              
              const updatedEmpresa = {
                ...empresa,
                imagenes: JSON.stringify([...existingImages, ...newImagesArray])
              };
              setEmpresa(updatedEmpresa);
              
              // Actualizar localStorage
              const updatedUser = {
                ...user,
                imagenes: updatedEmpresa.imagenes
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              window.dispatchEvent(new Event('storage'));
            }}
          />
        )}
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
};