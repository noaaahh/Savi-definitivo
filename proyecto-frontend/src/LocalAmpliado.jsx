import React, { useState, useEffect } from "react";
import "./LocalAmpliado.css";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaCheck,
  FaStar
} from "react-icons/fa";
import StarRating from './components/StarRating';
import { useAuth } from './hooks/useAuth';


const LocalAmpliado = ({ local, onGoBack }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  // Debug: Ver qué datos están llegando
  console.log('LocalAmpliado - Datos recibidos:', local);

  // Convertir la estructura de datos del backend al formato esperado
  const localData = local ? {
    nombre: local.nombre || "Sin nombre",
    descripcion: local.descripcion || "Sin descripción",
    direccion: local.direccion || "Sin dirección",
    telefono: local.contacto || local.telefono || "Sin teléfono",
    email: local.email || "Sin email",
    calificacion: 4.5, // Valor por defecto
    horario: local.horario || "Sin horario",
    accesibilidades: local.accesibilidad ? Object.entries(local.accesibilidad)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => {
        // Mapear las claves del backend a nombres legibles
        const accesibilidadMap = {
          'ramp': 'Rampa',
          'banoAdaptado': 'Baño adaptado',
          'braille': 'Braille',
          'pisosAntideslizantes': 'Pisos antideslizantes',
          'mesasSillasAdaptadas': 'Mesas y sillas adaptadas',
          'elevator': 'Ascensor',
          'pasillos': 'Pasillos min 90cm',
          'puertaAncha': 'Puerta ancha',
          'contrasteColores': 'Contraste de colores',
          'guiasPodotactiles': 'Guías podotáctiles',
          'alarmasEmergencia': 'Alarmas de emergencia',
          'sistemaAudifonos': 'Sistema de audífonos'
        };
        return accesibilidadMap[key] || key;
      }) : [],
    imagenes: local.imagenes ? (() => {
      try {
        if (typeof local.imagenes === 'string') {
          return JSON.parse(local.imagenes);
        }
        return Array.isArray(local.imagenes) ? local.imagenes : [];
      } catch (error) {
        console.error('Error parsing imagenes:', error);
        return [];
      }
    })() : []
  } : {
    nombre: "Estrella Fresca",
    descripcion: "Supermercado uruguayo con más de 20 años en el rubro y 60 locales en todo el país. Se enfoca en la inclusión y la proximidad con el cliente, ofreciendo productos de calidad y locales accesibles para todos.",
    direccion: "Carlos Quijano 1067, apto 9",
    telefono: "099 999 999",
    email: "contacto@estrellafresca.com.uy",
    calificacion: 4.5,
    horario: "Lun a Vie 8:00 - 21:00",
    accesibilidades: [
      "Rampa",
      "Atención prioritaria",
      "Baño adaptado",
      "Caja accesible",
      "Ascensor"
    ],
    imagenes: [
      "https://i.imgur.com/BBojpYB.png",
      "https://i.imgur.com/6LvOxdx.png",
      "https://i.imgur.com/jo6rH6V.png"
    ]
  };


  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;


    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }


    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }


    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }


    return stars;
  };

  // Debug: Ver los datos procesados
  console.log('LocalAmpliado - Datos procesados:', localData);

  // Cargar calificaciones cuando se monta el componente
  useEffect(() => {
    if (local && local.empresa_id) {
      loadRatings();
    }
  }, [local]);

  // Cargar calificaciones desde la API
  const loadRatings = async () => {
    try {
      // Cargar promedio de calificaciones
      const promedioResponse = await fetch(`http://localhost:3001/api/calificaciones/${local.empresa_id}/promedio`);
      const promedioData = await promedioResponse.json();
      
      if (promedioData.success) {
        setAverageRating(promedioData.promedio.promedio || 0);
        setTotalRatings(promedioData.promedio.totalCalificaciones || 0);
      }

      // Si el usuario está autenticado y es personal, cargar su calificación
      if (isAuthenticated && user && user.tipo === 'usuario') {
        const token = localStorage.getItem('token');
        const userRatingResponse = await fetch(`http://localhost:3001/api/calificaciones/${local.empresa_id}/usuario`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userRatingData = await userRatingResponse.json();
        
        if (userRatingData.success && userRatingData.calificacion) {
          setUserRating(userRatingData.calificacion.puntuacion);
        }
      }
    } catch (error) {
      console.error('Error cargando calificaciones:', error);
    }
  };

  // Manejar cambio de calificación
  const handleRatingChange = async (rating) => {
    if (!isAuthenticated || !user || user.tipo !== 'usuario') {
      alert('Debes iniciar sesión como usuario personal para calificar');
      return;
    }

    setRatingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/calificaciones/${local.empresa_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ puntuacion: rating })
      });

      const data = await response.json();
      
      if (data.success) {
        setUserRating(rating);
        setAverageRating(data.promedio.promedio);
        setTotalRatings(data.promedio.totalCalificaciones);
        alert('¡Calificación guardada exitosamente!');
      } else {
        throw new Error(data.error || 'Error al guardar calificación');
      }
    } catch (error) {
      console.error('Error guardando calificación:', error);
      alert(`Error al guardar calificación: ${error.message}`);
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="local-ampliado">
      <header className="local-header">
        <div className="header-buttons">
          <button className="btn-ayuda">Ayuda</button>
          <button className="btn-volver" onClick={onGoBack}>Volver atrás</button>
        </div>
        <div className="header-content">
          <h1 className="local-nombre">{localData.nombre}</h1>
          <p className="local-descripcion">{localData.descripcion}</p>
        </div>
      </header>


      <main className="local-main">
        <div className="main-card">
          <button
            className="btn-email"
            onClick={() => setShowEmailForm(!showEmailForm)}
            aria-label="Enviar email"
          >
            Enviar email
          </button>

          <section className="contacto-section">
            <h2>Contacto</h2>
            <div className="contacto-info">
              <div className="contacto-item">
                <FaMapMarkerAlt className="contacto-icon" />
                <span className="contacto-label">Dirección:</span>
                <span className="contacto-value">{localData.direccion}</span>
              </div>
              <div className="contacto-item">
                <FaPhone className="contacto-icon" />
                <span className="contacto-label">Teléfono:</span>
                <span className="contacto-value">{localData.telefono}</span>
              </div>
              <div className="contacto-item">
                <FaClock className="contacto-icon" />
                <span className="contacto-label">Horario:</span>
                <span className="contacto-value">{localData.horario || localData.horarios || 'No disponible'}</span>
              </div>
            </div>
          </section>


          <section className="accesibilidades-section">
            <h2>Accesibilidades</h2>
            <div className="accesibilidades-list">
              {localData.accesibilidades && Array.isArray(localData.accesibilidades) ? 
                localData.accesibilidades.map((item, index) => (
                  <div key={index} className="accesibilidad-item">
                    <FaCheck className="check-icon" />
                    <span>{item}</span>
                  </div>
                )) : (
                  <p>No hay información de accesibilidad disponible</p>
                )
              }
            </div>
          </section>


          <section className="calificacion-section">
            <div className="calificacion-box">
              <h3>Calificación de los clientes</h3>
              
              {/* Calificación promedio */}
              <div className="average-rating-section">
                <StarRating
                  empresaId={local.empresa_id}
                  userRating={0}
                  averageRating={averageRating}
                  totalRatings={totalRatings}
                  isReadOnly={true}
                  showAverage={true}
                />
              </div>

              {/* Calificación del usuario (solo si está logueado como usuario personal) */}
              {isAuthenticated && user && user.tipo === 'usuario' && (
                <div className="user-rating-section">
                  <h4>Tu calificación:</h4>
                  <StarRating
                    empresaId={local.empresa_id}
                    userRating={userRating}
                    averageRating={0}
                    totalRatings={0}
                    onRatingChange={handleRatingChange}
                    isReadOnly={false}
                    showAverage={false}
                  />
                  {ratingLoading && <p>Cargando...</p>}
                </div>
              )}

              {/* Mensaje para usuarios no autenticados */}
              {!isAuthenticated && (
                <div className="login-prompt">
                  <p>Inicia sesión como usuario personal para calificar este local</p>
                </div>
              )}
            </div>
          </section>
        </div>


        <section className="galeria-section">
          {localData.imagenes && Array.isArray(localData.imagenes) && localData.imagenes.length > 0 ? 
            localData.imagenes.map((imagen, index) => (
              <div key={index} className="galeria-item">
                <img src={imagen} alt={`${localData.nombre} - Imagen ${index + 1}`} />
              </div>
            )) : (
              <p>No hay imágenes disponibles</p>
            )
          }
        </section>
      </main>


      <footer className="local-footer">
        <div className="footer-socials">
          <FaInstagram className="social-icon" />
          <FaLinkedin className="social-icon" />
          <FaWhatsapp className="social-icon" />
          <FaEnvelope className="social-icon" />
        </div>
        <div className="footer-contact">
          <span>Contacto: 091 222 333</span>
          <span>savi@gmail.com.uy</span>
        </div>
      </footer>


      {showEmailForm && (
        <div className="email-modal-overlay">
          <div className="email-modal">
            <div className="modal-header">
              <h3>Contactar a {localData.nombre}</h3>
              <button className="close-modal" onClick={() => setShowEmailForm(false)}>×</button>
            </div>
            <form className="email-form">
              <div className="form-group">
                <label htmlFor="email-subject">Asunto:</label>
                <input 
                  id="email-subject"
                  type="text" 
                  placeholder="Consulta sobre accesibilidad..."
                  className="email-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email-message">Mensaje:</label>
                <textarea
                  id="email-message"
                  placeholder="Hola! Me gustaría saber más sobre las opciones de accesibilidad disponibles en su local. ¿Podrían proporcionarme más información sobre..."
                  rows="5"
                  className="email-textarea"
                ></textarea>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowEmailForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-send">
                   Enviar mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default LocalAmpliado;
