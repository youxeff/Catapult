import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, image, name, priceRange, trendScore, lastUpdated }) => {
  const navigate = useNavigate();
  
  if (!name) return null;

  const handleClick = () => {
    navigate(`/product/${id}`, { 
      state: { 
        id,
        image, 
        name, 
        priceRange, 
        trendScore, 
        lastUpdated
      } 
    });
  };

  return (
    <div 
      onClick={handleClick} 
      className={`
        flex-none w-[250px] 
        bg-card text-card-foreground
        rounded-xl p-4 cursor-pointer
        border border-border
        hover:scale-105 hover:bg-muted
        transform transition-all duration-200 ease-in-out
        theme-transition
      `}
    >
      <div className="w-full h-[200px] mb-4 rounded-lg overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'https://via.placeholder.com/200';
          }}
          loading="lazy"
        />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-bold mb-2 text-foreground">{name}</h3>
        <p className="text-primary mb-2">{priceRange || 'Price unavailable'}</p>
        <div className="mt-3">
          <span className="block text-sm text-muted-foreground mb-1">Trend Score</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ 
                  width: `${typeof trendScore === 'number' ? trendScore : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-primary font-medium">
              {typeof trendScore === 'number' ? `${trendScore}%` : '0%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;