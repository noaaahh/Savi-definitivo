import React from 'react';
import './TopActionHeader.css';

const TopActionHeader = ({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBackClick,
  showSearchButton = false,
  onSearchClick,
  showFilterButton = false,
  onFilterClick,
  showAddButton = false,
  onAddClick,
  customActions = null
}) => {
  return (
    <div className="top-action-header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton && (
            <button 
              className="action-button back-button"
              onClick={onBackClick}
              aria-label="Volver"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          
          <div className="header-text">
            <h1 className="header-title">{title}</h1>
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="header-right">
          {customActions && (
            <div className="custom-actions">
              {customActions}
            </div>
          )}
          
          {showSearchButton && (
            <button 
              className="action-button search-button"
              onClick={onSearchClick}
              aria-label="Buscar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          )}
          
          {showFilterButton && (
            <button 
              className="action-button filter-button"
              onClick={onFilterClick}
              aria-label="Filtrar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
            </button>
          )}
          
          {showAddButton && (
            <button 
              className="action-button add-button primary"
              onClick={onAddClick}
              aria-label="Agregar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopActionHeader;
