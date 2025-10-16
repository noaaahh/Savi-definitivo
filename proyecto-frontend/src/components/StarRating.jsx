import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ 
  empresaId, 
  userRating = 0, 
  averageRating = 0, 
  totalRatings = 0, 
  onRatingChange,
  isReadOnly = false,
  showAverage = true 
}) => {
  const [rating, setRating] = useState(userRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(userRating);
  }, [userRating]);

  const handleClick = (ratingValue) => {
    if (isReadOnly) return;
    
    setRating(ratingValue);
    if (onRatingChange) {
      onRatingChange(ratingValue);
    }
  };

  const handleMouseEnter = (ratingValue) => {
    if (isReadOnly) return;
    setHover(ratingValue);
  };

  const handleMouseLeave = () => {
    if (isReadOnly) return;
    setHover(0);
  };

  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= (hover || rating) ? 'active' : 'inactive'}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
      
      {showAverage && (
        <div className="rating-info">
          <span className="average-rating">
            {averageRating > 0 ? averageRating.toFixed(1) : 'Sin calificaciones'}
          </span>
          {totalRatings > 0 && (
            <span className="total-ratings">
              ({totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
