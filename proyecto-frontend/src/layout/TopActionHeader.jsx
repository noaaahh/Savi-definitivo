import React from 'react';
import './TopActionHeader.css';

const TopActionHeader = ({ leftButtons = [], rightButtons = [] }) => {
  return (
    <div className="top-action-header">
      <div className="top-action-header__left">
        {leftButtons.map((button, index) => (
          <button
            key={index}
            className="top-action-header__button top-action-header__button--left"
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="top-action-header__right">
        {rightButtons.map((button, index) => (
          <button
            key={index}
            className="top-action-header__button top-action-header__button--right"
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopActionHeader;
