import React from 'react';

const ProductCard = ({ image, name, priceRange, trendScore, lastUpdated }) => {
  // Handle missing or loading data
  if (!name) return null;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={image || 'https://via.placeholder.com/200'} 
          alt={name} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="price-range">{priceRange || 'Price unavailable'}</p>
        <div className="trend-score">
          <span>Trend Score</span>
          <div 
            className="score-bar" 
            style={{ 
              width: `${typeof trendScore === 'number' ? trendScore : 0}%`,
              opacity: typeof trendScore === 'number' ? 0.8 : 0.3
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;