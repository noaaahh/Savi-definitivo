import React, { useState, useEffect } from "react";
import "./InicioUsuario.css";
import { FaInstagram, FaLinkedin, FaWhatsapp, FaSearch } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { BsFilterLeft } from "react-icons/bs";
import LocalAmpliado from "./LocalAmpliado";
import NavigationBar from './components/NavigationBar';
import { goBack } from './utils/navigation';

const InicioUsuario = ({ onBack, onGoInicio }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    rampa: false,
    banoAccesible: false,
    braille: false,
    interprete: false,
    pisosAntideslizantes: false,
    mesasSillasAdaptadas: false,
    ascensor: false,
    pasillosMin90cm: false,
    puerta80cm: false,
    contrasteColores: false,
    guiasPodotactiles: false,
    alarmasEmergencia: false,
    sistemaAudifonos: false
  });
  const [query, setQuery] = useState("");
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [filteredLocales, setFilteredLocales] = useState([]);
  const [empresasData, setEmpresasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleFilter = () => setIsFilterOpen((v) => !v);
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

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
  
  const handleGoBack = () => setSelectedLocal(null);

  const handleSearchSubmit = () => {
    // Puedes agregar lógica adicional aquí si lo necesitas
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleClearFilters = () => {
    setFilters({
      rampa: false,
      banoAccesible: false,
      braille: false,
      interprete: false,
      pisosAntideslizantes: false,
      mesasSillasAdaptadas: false,
      ascensor: false,
      pasillosMin90cm: false,
      puerta80cm: false,
      contrasteColores: false,
      guiasPodotactiles: false,
      alarmasEmergencia: false,
      sistemaAudifonos: false
    });
    setQuery("");
  };

  // Cargar empresas desde la base de datos
  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/empresas');
      const data = await response.json();
      console.log("Respuesta de la API:", data); // <-- Agregado para depuración
      if (data.success) {
        setEmpresasData(data.empresas || []);
      } else {
        setError('Error al cargar las empresas');
      }
    } catch (error) {
      setError('Error de conexión al cargar empresas');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    cargarEmpresas();
  }, []);

  useEffect(() => {
    let filtered = empresasData;

    // Filtrar por término de búsqueda
    if (query.trim() !== "") {
      filtered = filtered.filter(empresa =>
        empresa.nombre?.toLowerCase().includes(query.toLowerCase()) ||
        empresa.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
        empresa.direccion?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtrar por checkboxes de accesibilidad
    const activeFilters = Object.keys(filters).filter(key => filters[key]);
    if (activeFilters.length > 0) {
      filtered = filtered.filter(empresa => {
        return activeFilters.some(filter => {
          const accesibilidad = empresa.accesibilidad || {};
          const filterMap = {
            rampa: accesibilidad.ramp,
            banoAccesible: accesibilidad.banoAdaptado,
            braille: accesibilidad.braille,
            interprete: accesibilidad.interprete,
            pisosAntideslizantes: accesibilidad.pisosAntideslizantes,
            mesasSillasAdaptadas: accesibilidad.mesasSillasAdaptadas,
            ascensor: accesibilidad.elevator,
            pasillosMin90cm: accesibilidad.pasillos,
            puerta80cm: accesibilidad.puertaAncha,
            contrasteColores: accesibilidad.contrasteColores,
            guiasPodotactiles: accesibilidad.guiasPodotactiles,
            alarmasEmergencia: accesibilidad.alarmasEmergencia,
            sistemaAudifonos: accesibilidad.sistemaAudifonos
          };
          return filterMap[filter] === true;
        });
      });
    }

    setFilteredLocales(filtered);
  }, [query, filters, empresasData]);

  const cards = filteredLocales;

  if (selectedLocal) {
    return (
      <LocalAmpliado
        local={selectedLocal}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <div className="inicioUsuario">
      <NavigationBar
        leftButtons={[
          { label: 'Inicio', onClick: onGoInicio, primary: true },
          { label: 'Volver atrás', onClick: goBack, primary: false }
        ]}
      />
      <section className="inicioUsuario__hero">
        <img
          className="inicioUsuario__hero-img"
          src="https://i.imgur.com/9bmoDHn.png"
          alt="Bienvenida"
        />
        <h1 className="inicioUsuario__title">¡Te damos la bienvenida!</h1>
      </section>

      <section className="inicioUsuario__toolbar">
        <div className="inicioUsuario__filter">
          <button className="inicioUsuario__filter-toggle" onClick={toggleFilter}>
            <BsFilterLeft />
            Filtro
          </button>
          {isFilterOpen && (
            <div className="inicioUsuario__filter-panel">
              <label><input type="checkbox" name="rampa" checked={filters.rampa} onChange={handleFilterChange} /> Rampa</label>
              <label><input type="checkbox" name="banoAccesible" checked={filters.banoAccesible} onChange={handleFilterChange} /> Baño adaptado</label>
              <label><input type="checkbox" name="braille" checked={filters.braille} onChange={handleFilterChange} /> Braille</label>
              <label><input type="checkbox" name="interprete" checked={filters.interprete} onChange={handleFilterChange} /> Intérprete</label>
              <label><input type="checkbox" name="pisosAntideslizantes" checked={filters.pisosAntideslizantes} onChange={handleFilterChange} /> Pisos antideslizantes</label>
              <label><input type="checkbox" name="mesasSillasAdaptadas" checked={filters.mesasSillasAdaptadas} onChange={handleFilterChange} /> Sillas adaptadas </label>
              <label><input type="checkbox" name="ascensor" checked={filters.ascensor} onChange={handleFilterChange} /> Ascensor </label>
              <label><input type="checkbox" name="pasillosMin90cm" checked={filters.pasillosMin90cm} onChange={handleFilterChange} /> Pasillos 90cm</label>
              <label><input type="checkbox" name="puerta80cm" checked={filters.puerta80cm} onChange={handleFilterChange} /> Puerta ancha</label>

              <br>
              </br>

              <label><input type="checkbox" name="contrasteColores" checked={filters.contrasteColores} onChange={handleFilterChange} /> Contraste Colores </label>
              <label><input type="checkbox" name="guiasPodotactiles" checked={filters.guiasPodotactiles} onChange={handleFilterChange} /> Guías podotáctiles </label>
              <label><input type="checkbox" name="alarmasEmergencia" checked={filters.alarmasEmergencia} onChange={handleFilterChange} /> Alarmas emergencia visuales y sonoras </label>
              <label><input type="checkbox" name="sistemaAudifonos" checked={filters.sistemaAudifonos} onChange={handleFilterChange} /> Sistema de apoyo para personas con audífonos </label>
            </div>
          )}
        </div>
        <div className="inicioUsuario__search-container">
          <input
            className="inicioUsuario__search"
            type="text"
            placeholder="Buscar aquí"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="inicioUsuario__search-icon clickable" onClick={handleSearchSubmit}>
            <FaSearch />
          </div>
        </div>
      </section>

      <section className="inicioUsuario__grid">
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          <div style={{ marginBottom: '10px' }}>
            {loading ? (
              'Cargando empresas...'
            ) : error ? (
              `Error: ${error}`
            ) : query || Object.values(filters).some(f => f) ?
              `Mostrando ${cards.length} locales de ${empresasData.length}` :
              `${cards.length} locales disponibles`
            }
          </div>
          {(query || Object.values(filters).some(f => f)) && !loading && (
            <button
              onClick={handleClearFilters}
              style={{
                background: '#0077b6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p>Cargando empresas desde la base de datos...</p>
          </div>
        ) : error ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
            <p>Error al cargar empresas: {error}</p>
            <button
              onClick={cargarEmpresas}
              style={{
                background: '#0077b6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Reintentar
            </button>
          </div>
        ) : cards.length > 0 ? (
          cards.map((empresa) => {
            // Obtener la primera imagen del local o usar imagen por defecto
            let imagenUrl = 'https://i.imgur.com/ZifMmLa.jpeg'; // Imagen por defecto
            
            if (empresa.imagenes) {
              try {
                const imagenes = JSON.parse(empresa.imagenes);
                if (imagenes && imagenes.length > 0) {
                  imagenUrl = imagenes[0];
                }
              } catch (e) {
                console.error('Error al parsear imágenes:', e);
              }
            }

            return (
            <div
              key={empresa.empresa_id || empresa.id}
              className="inicioUsuario__card"
              style={{
                backgroundImage: `url(${imagenUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="inicioUsuario__card-overlay">
                <div className="inicioUsuario__card-content">
                  <div className="inicioUsuario__card-title">
                    {empresa.nombre}
                    {empresa.accesibilidad && (
                      <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.9 }}>
                        {Object.entries(empresa.accesibilidad)
                          .filter(([key, value]) => value === true)
                          .slice(0, 2)
                          .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
                          .join(', ')}
                      </div>
                    )}
                  </div>
                  <button
                    className="inicioUsuario__card-button"
                    onClick={() => handleCardClick(empresa)}
                  >
                    Ver →
                  </button>
                </div>
              </div>
            </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No se encontraron locales que coincidan con tu búsqueda.</p>
            <p>Intenta con otros términos o filtros.</p>
          </div>
        )}
      </section>

      <footer className="inicioUsuario__footer">
        <div className="inicioUsuario__footer-left">
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="WhatsApp"><FaWhatsapp /></a>
          <a href="#" aria-label="Email"><MdMailOutline /></a>
        </div>
        <div className="inicioUsuario__footer-right">Contacto: 091 222 333 — savi@gmail.com.uy</div>
      </footer>
    </div>
  );
};

export default InicioUsuario;