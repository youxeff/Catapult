import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, price, supplier, rating, lastUpdated }) => {
  const navigate = useNavigate();
  
  if (!name) return null;

  const handleClick = () => {
    navigate(`/product/${id}`, { 
      state: { 
        id,
        name, 
        description: `A ${name} from ${supplier}`,
        priceRange: `$${price?.toFixed(2)}`,
        image: "https://via.placeholder.com/400",
        trendScore: rating ? rating * 20 : 0,
        category: supplier,
        sellers: [supplier],
        price,
        rating,
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
      <div className="text-left">
        <h3 className="text-lg font-bold mb-2 text-foreground">{name}</h3>
        <p className="text-primary mb-2">${price?.toFixed(2) || 'Price unavailable'}</p>
        <p className="text-sm text-muted-foreground mb-2">Supplier: {supplier || 'Unknown'}</p>
        <div className="mt-3">
          <span className="block text-sm text-muted-foreground mb-1">Rating</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ 
                  width: `${typeof rating === 'number' ? (rating * 20) : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-primary font-medium">
              {typeof rating === 'number' ? rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;