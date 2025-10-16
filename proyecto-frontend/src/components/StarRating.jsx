import React from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ 
  empresaId, 
  userRating, 
  averageRating, 
  totalRatings, 
  onRatingChange, 
  isReadOnly = false, 
  showAverage = false 
}) => {
  const handleStarClick = (rating) => {
    if (!isReadOnly && onRatingChange) {
      onRatingChange(rating);
    }
  };

  const renderStars = (rating, isInteractive = false) => {
    console.log('renderStars called with:', { rating, isInteractive });
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      const isHalfFilled = starValue - 0.5 <= rating && rating < starValue;
      
      const className = `star ${isFilled ? 'filled' : ''} ${isHalfFilled ? 'half' : ''} ${isInteractive ? 'interactive' : ''}`;
      console.log(`Star ${index + 1}:`, { starValue, isFilled, isHalfFilled, className });
      
      return (
        <span
          key={index}
          className={className}
          onClick={() => isInteractive && handleStarClick(starValue)}
          style={{ cursor: isInteractive ? 'pointer' : 'default' }}
        >
          <FaStar />
        </span>
      );
    });
  };

  return (
    <div className="star-rating">
      {showAverage && (
        <div className="rating-summary">
          <div className="stars-display">
            {renderStars(averageRating)}
          </div>
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <span className="rating-count">({totalRatings} calificaciones)</span>
        </div>
      )}
      
      {!isReadOnly && (
        <div className="user-rating">
          <div className="stars-interactive">
            {renderStars(userRating, true)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StarRating;
