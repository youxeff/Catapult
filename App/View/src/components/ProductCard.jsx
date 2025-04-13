import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, price, supplier, rating, lastUpdated, imageUrl }) => {
  const navigate = useNavigate();
  
  if (!name) return null;

  const handleClick = () => {
    navigate(`/product/${id}`, { 
      state: { 
        id,
        name, 
        description: `A ${name} from ${supplier}`,
        priceRange: `$${price?.toFixed(2)}`,
        image: imageUrl, // Remove fallback here since we'll handle it in the img tag
        trendScore: rating ? rating * 20 : 0,
        category: supplier,
        sellers: [supplier],
        price,
        rating,
        lastUpdated,
        imageUrl
      } 
    });
  };

  const ratingPercentage = typeof rating === 'number' ? (rating * 20) : 0;
  const formattedPrice = price?.toFixed(2) || 'Price unavailable';
  const placeholderImage = "https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <div 
      onClick={handleClick} 
      className={`
        group relative flex flex-col
        bg-card text-card-foreground
        rounded-xl overflow-hidden
        border border-border/50
        hover:border-border
        hover:shadow-lg
        transform transition-all duration-200 ease-out
        cursor-pointer
      `}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl || placeholderImage}
          alt={name}
          className="w-full h-full object-cover object-center
            group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = placeholderImage;
          }}
        />
        {rating && rating >= 4.5 && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground 
            px-2 py-1 rounded-full text-xs font-medium">
            Trending
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <div className="flex-grow">
          <h3 className="font-medium text-foreground line-clamp-2 mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {supplier || 'Unknown supplier'}
          </p>
        </div>

        {/* Price and Rating */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              ${formattedPrice}
            </span>
          </div>

          {rating && (
            <div className="flex items-center gap-2">
              <div className="flex-grow h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${ratingPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-primary">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 
        transition-opacity duration-200" />
    </div>
  );
};

export default ProductCard;