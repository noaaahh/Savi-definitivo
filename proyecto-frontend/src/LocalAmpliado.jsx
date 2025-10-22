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
  FaStar,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import StarRating from './components/StarRating';
import { useAuth } from './hooks/useAuth';
import { goBack } from './utils/navigation';


const LocalAmpliado = ({ local, onGoBack }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
    calificacion: 0, // Valor por defecto
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
    calificacion: 0,
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

  // Recargar calificaciones cuando cambie el usuario autenticado
  useEffect(() => {
    if (local && local.empresa_id && isAuthenticated && user) {
      loadRatings();
    }
  }, [isAuthenticated, user]);

  // Resetear el índice de imagen cuando cambie el local
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [local]);

  // Asegurar que el índice actual no exceda el límite de imágenes
  useEffect(() => {
    const limitedImages = getLimitedImages();
    if (currentImageIndex >= limitedImages.length) {
      setCurrentImageIndex(0);
    }
  }, [localData.imagenes, currentImageIndex]);

  // Cargar calificaciones desde localStorage
  const loadRatings = async () => {
    try {
      // Simular un promedio real basado en calificaciones guardadas
      const allRatingsKey = `all_ratings_${local.empresa_id}`;
      const allRatings = JSON.parse(localStorage.getItem(allRatingsKey) || '[]');
      
      console.log('Cargando calificaciones para empresa:', local.empresa_id);
      console.log('Todas las calificaciones:', allRatings);
      
      if (allRatings.length > 0) {
        const sum = allRatings.reduce((acc, ratingObj) => acc + ratingObj.rating, 0);
        const average = sum / allRatings.length;
        console.log('Promedio calculado:', average);
        setAverageRating(average);
        setTotalRatings(allRatings.length);
      } else {
        // Valor por defecto si no hay calificaciones
        console.log('No hay calificaciones, usando valor por defecto');
        setAverageRating(0);
        setTotalRatings(0);
      }
      
      // Si el usuario está autenticado y es personal, cargar su calificación desde localStorage
      if (isAuthenticated && user && user.tipo === 'usuario') {
        const ratingKey = `rating_${user.usuario_id}_${local.empresa_id}`;
        const savedRating = localStorage.getItem(ratingKey);
        console.log('Buscando calificación del usuario:', ratingKey, 'Valor:', savedRating);
        if (savedRating) {
          const ratingValue = parseInt(savedRating);
          console.log('Cargando calificación del usuario:', ratingValue);
          setUserRating(ratingValue);
        } else {
          setUserRating(0);
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

    // Actualizar el estado inmediatamente para feedback visual
    setUserRating(rating);
    
    setRatingLoading(true);
    try {
      // Guardar la calificación del usuario
      const ratingKey = `rating_${user.usuario_id}_${local.empresa_id}`;
      localStorage.setItem(ratingKey, rating.toString());
      
      // Actualizar la lista de todas las calificaciones para calcular el promedio
      const allRatingsKey = `all_ratings_${local.empresa_id}`;
      const allRatings = JSON.parse(localStorage.getItem(allRatingsKey) || '[]');
      
      // Verificar si el usuario ya había calificado antes
      const existingRatingIndex = allRatings.findIndex(r => r.userId === user.usuario_id);
      
      if (existingRatingIndex !== -1) {
        // Actualizar calificación existente
        allRatings[existingRatingIndex].rating = rating;
      } else {
        // Agregar nueva calificación
        allRatings.push({ userId: user.usuario_id, rating: rating });
      }
      
      localStorage.setItem(allRatingsKey, JSON.stringify(allRatings));
      
      // Recalcular promedio
      const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
      const average = sum / allRatings.length;
      
      setUserRating(rating);
      setAverageRating(average);
      setTotalRatings(allRatings.length);
      
      // Simular guardado exitoso
      setTimeout(() => {
        setRatingLoading(false);
        console.log(`Calificación ${rating} guardada para empresa ${local.empresa_id}. Nuevo promedio: ${average.toFixed(1)}`);
      }, 500);
      
    } catch (error) {
      console.error('Error guardando calificación:', error);
      setRatingLoading(false);
    }
  };

  // Obtener la primera imagen del local para el fondo (solo una imagen estática)
  const getBackgroundImage = () => {
    if (localData.imagenes && Array.isArray(localData.imagenes) && localData.imagenes.length > 0) {
      return localData.imagenes[0]; // Solo la primera imagen
    }
    // Imagen por defecto si no hay imágenes
    return 'https://i.imgur.com/DhnHKJr.png';
  };

  // Obtener las imágenes limitadas a 9 máximo
  const getLimitedImages = () => {
    if (localData.imagenes && Array.isArray(localData.imagenes) && localData.imagenes.length > 0) {
      return localData.imagenes.slice(0, 9); // Límite de 9 imágenes
    }
    return [];
  };

  // Funciones para navegar el carrusel (navegación por grupos de 3)
  const nextImage = () => {
    const limitedImages = getLimitedImages();
    if (limitedImages.length > 3) {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex + 3;
        return nextIndex >= limitedImages.length ? 0 : nextIndex;
      });
    }
  };

  const prevImage = () => {
    const limitedImages = getLimitedImages();
    if (limitedImages.length > 3) {
      setCurrentImageIndex((prevIndex) => {
        const prevIndexNew = prevIndex - 3;
        return prevIndexNew < 0 ? Math.max(0, limitedImages.length - 3) : prevIndexNew;
      });
    }
  };

  return (
    <div className="local-ampliado">
      <header 
        className="local-header"
        style={{
          background: `linear-gradient(
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.4)
          ), url('${getBackgroundImage()}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(0px)',
          position: 'relative'
        }}
      >
        {/* Capa de blur para el fondo */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url('${getBackgroundImage()}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
            zIndex: -1
          }}
        />
        {/* Overlay oscuro */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 0
          }}
        />
        <div className="header-buttons">
          <button className="btn-inicio" onClick={() => (window.location.hash = '#inicio')}>Inicio</button>
          <button className="btn-volver" onClick={goBack}>Volver atrás</button>
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
              {/* Promedio de calificación (solo lectura) */}
              <div className="average-rating-display">
                <h3>Calificación de los clientes</h3>
                {totalRatings > 0 ? (
                  <div className="rating-summary">
                    <div className="stars-display">
                      {[1, 2, 3, 4, 5].map((star) => {
                        let starClass = 'star-display empty';
                        if (star <= Math.floor(averageRating)) {
                          starClass = 'star-display filled';
                        } else if (star === Math.ceil(averageRating) && averageRating % 1 !== 0) {
                          starClass = 'star-display half';
                        }
                        return (
                          <FaStar
                            key={star}
                            className={starClass}
                          />
                        );
                      })}
                    </div>
                    <div className="rating-info">
                      <span className="rating-number">{averageRating.toFixed(1)}</span>
                      <span className="rating-count">({totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})</span>
                    </div>
                  </div>
                ) : (
                  <div className="no-ratings-message">
                    <div className="stars-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className="star-display empty"
                        />
                      ))}
                    </div>
                    <div className="rating-info">
                      <span className="rating-number">0.0</span>
                      <span className="rating-count">(0 calificaciones)</span>
                    </div>
                    <p className="first-rating-message">¡Se el primero en calificar este lugar!</p>
                  </div>
                )}
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
          <h2>Galería de Imágenes</h2>
          {(() => {
            const limitedImages = getLimitedImages();
            return limitedImages.length > 0 ? (
              <div className="galeria-carousel">
                {/* Flechas de navegación del carrusel */}
                {limitedImages.length > 3 && (
                  <>
                    <button 
                      className="galeria-arrow galeria-arrow-left"
                      onClick={prevImage}
                      aria-label="Imagen anterior"
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      className="galeria-arrow galeria-arrow-right"
                      onClick={nextImage}
                      aria-label="Imagen siguiente"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}

                {/* Contenedor de imágenes del carrusel */}
                <div className="galeria-images-container">
                  <div 
                    className="galeria-images-track"
                    style={{
                      transform: `translateX(-${currentImageIndex * (100 / 3)}%)`
                    }}
                  >
                    {limitedImages.map((imagen, index) => (
                      <div key={index} className="galeria-image-item">
                        <img 
                          src={imagen} 
                          alt={`${localData.nombre} - Imagen ${index + 1}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicadores del carrusel */}
                {limitedImages.length > 3 && (
                  <div className="galeria-indicators">
                    {Array.from({ length: Math.ceil(limitedImages.length / 3) }).map((_, index) => (
                      <button
                        key={index}
                        className={`galeria-indicator ${Math.floor(currentImageIndex / 3) === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index * 3)}
                        aria-label={`Ir a grupo ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Contador de imágenes */}
                <div className="galeria-counter">
                  {currentImageIndex + 1} de {limitedImages.length}
                  {localData.imagenes.length > 9 && (
                    <span className="limit-notice"> (máximo 9 mostradas)</span>
                  )}
                </div>
              </div>
            ) : (
              <p>No hay imágenes disponibles</p>
            );
          })()}
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
