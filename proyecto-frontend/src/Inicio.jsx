import React, { useState, useEffect } from "react";
import ModalLogin from "./ModalLogin";
import LocalAmpliado from "./LocalAmpliado";
import { useAuth } from "./hooks/useAuth";
import "./Inicio.css";
import "./InicioUsuario.css";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";

const Inicio = ({ onGoRegistro, onGoInicioUsuario }) => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [ultimosLocales, setUltimosLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocal, setSelectedLocal] = useState(null);

  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  // Manejar clic en tarjeta de local
  const handleCardClick = async (local) => {
    try {
      // Cargar datos completos de la empresa desde la API
      const response = await fetch(`http://localhost:3001/api/empresas/${local.empresa_id}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Datos completos cargados para LocalAmpliado:', data.empresa);
        setSelectedLocal(data.empresa);
      } else {
        console.error('Error cargando datos completos:', data.error);
        // Fallback: usar datos básicos
        setSelectedLocal(local);
      }
    } catch (error) {
      console.error('Error cargando datos completos:', error);
      // Fallback: usar datos básicos
      setSelectedLocal(local);
    }
  };

  // Manejar volver atrás desde LocalAmpliado
  const handleGoBack = () => setSelectedLocal(null);

  // Cargar los últimos locales desde el backend
  useEffect(() => {
    const fetchUltimosLocales = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/empresas/ultimos');
        const data = await response.json();
        
        if (data.success) {
          setUltimosLocales(data.empresas);
        } else {
          console.error('Error al cargar locales:', data.error);
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUltimosLocales();
  }, []);

  // Si hay un local seleccionado, mostrar LocalAmpliado
  if (selectedLocal) {
    return (
      <LocalAmpliado
        local={selectedLocal}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <div className="inicio">

      <section className="hero">
        <div className="nav-links">
          {!isAuthenticated && (
            <button onClick={() => setShowLogin(true)}>Iniciar sesión</button>
          )}
          {!isAuthenticated && (
            <button onClick={onGoRegistro}>Registrarse</button>
          )}
        </div>
        <div className="logo-title">
          <img src="https://i.imgur.com/5MlZOKV.png" alt="Logo SAVI" className="logo" />
          <h1 className="logo-title__title">S A V I</h1>
        </div>
        <p>
          Conectamos a las personas con locales gastronómicos accesibles,
          calificaciones reales y un sello de certificación que impulsa la
          inclusión.
        </p>
      </section>

      <section className="opciones">
        <h2>Locales destacados:</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando locales...</p>
          </div>
        ) : (
          <section className="inicioUsuario__grid">
            {ultimosLocales.length > 0 ? (
              ultimosLocales.map((local, index) => {
                // Obtener la primera imagen del local o usar imagen por defecto
                let imagenUrl = 'https://i.imgur.com/ZifMmLa.jpeg'; // Imagen por defecto
                
                if (local.imagenes) {
                  try {
                    const imagenes = JSON.parse(local.imagenes);
                    if (imagenes && imagenes.length > 0) {
                      imagenUrl = imagenes[0];
                    }
                  } catch (e) {
                    console.error('Error al parsear imágenes:', e);
                  }
                }

                return (
                  <div
                    key={local.empresa_id}
                    className="inicioUsuario__card"
                    style={{ 
                      backgroundImage: `url(${imagenUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                    onClick={() => handleCardClick(local)}
                  >
                    <div className="inicioUsuario__card-overlay">
                      <div className="inicioUsuario__card-content">
                        <div className="inicioUsuario__card-title">
                          {local.nombre}
                          {local.direccion && (
                            <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.9 }}>
                              {local.direccion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
                <p>No hay locales registrados aún.</p>
              </div>
            )}
          </section>
        )}
        <div className="ver-todos-link">
          <button onClick={onGoInicioUsuario} className="link-button">
            Ver todos los comercios
          </button>
        </div>
      </section>

      <section className="quienes-somos">
        <div className="texto">
          <h2>¿Quiénes somos?</h2>
          <p> Nuestro equipo SAVI está conformado por 9 integrantes comprometidos con la accesibilidad y la creación de entornos más inclusivos.</p>
          <div className="quienes-grid">
            <div className="quienes-card">
              <h3>Misión</h3>
              <p>Nos encargamos de facilitar el paso a información sobre locales accesibles en Montevideo, para que las personas en situación de disapacidad puedan elegir y disfrutar con libertad y confianza a través de una herramienta digital.</p>
            </div>
            <div className="quienes-card">
              <h3>Visión</h3>
              <p>Buscamos convertirnos en la plataforma líder en inclusión digital en Montevideo y Uruguay, expandiéndose a otros rubros y promoviendo una sociedad más accesible, justa y participativa.</p>
            </div>
            <div className="quienes-card">
              <h3>Valores</h3>
              <p><strong>Inclusión</strong>: participación para todos. <strong>Accesibilidad</strong>: eliminación de barreras. <strong>Innovación</strong>: tecnología para mejorar vidas. <strong>Responsabilidad social</strong>: compromiso empresarial con la accesibilidad. <strong>Transparencia</strong>: información clara y confiable.</p>
            </div>
            <div className="quienes-card">
              <h3>Colaboradores</h3>
              <p>Para colaborar puedes ponerte en contacto con nosotros a través de nuestro mail o redes sociales.</p>
            </div>
          </div>
          <div className="contacto-centrado">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSedbA9MW9OLE-KpcYjyagUL7r2RMYh987UuhBZWXo6wNRkV7A/viewform">
            <button className="contacto-btn">Contactanos</button>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-socials">
          <span><FaInstagram /></span>
          <span><FaLinkedin /></span>
          <span><FaWhatsapp /></span>
          <span><MdMailOutline /></span>
        </div>
        <div className="footer-text">Contacto: 091 222 333 — savi@gmail.com.uy</div>
      </footer>
      <ModalLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={onGoInicioUsuario} />
    </div>
  );
};

export default Inicio;