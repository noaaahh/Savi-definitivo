import React from 'react';

const TopActionHeader = ({ leftButtons = [], rightButtons = [] }) => {
  return (
    <div className="top-action-header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      marginBottom: '1rem'
    }}>
      {/* Botones izquierdos */}
      <div className="left-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
        {leftButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Botones derechos */}
      <div className="right-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
        {rightButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#545b62'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopActionHeader;
