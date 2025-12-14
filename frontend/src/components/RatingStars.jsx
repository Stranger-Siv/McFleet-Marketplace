import { useState } from 'react';

function RatingStars({ rating, onRatingChange, disabled = false, size = '24px' }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (value) => {
    if (!disabled && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value) => {
    if (!disabled) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  const displayRating = hoveredRating || rating || 0;

  return (
    <div 
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        cursor: disabled ? 'default' : 'pointer'
      }}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          style={{
            fontSize: size,
            color: star <= displayRating ? '#fbbf24' : '#4b5563',
            transition: 'all 0.2s ease',
            userSelect: 'none',
            cursor: disabled ? 'default' : 'pointer',
            transform: !disabled && star <= displayRating ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;

