import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, price, supplier, rating, lastUpdated, imageUrl, description, sold_today, sold_1_month_ago, list_velocity }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const placeholderImage = "https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1600";
  
  if (!name) return null;

  const handleClick = () => {
    navigate(`/product/${id}`, { 
      state: { 
        id,
        name, 
        price,
        supplier,
        rating,
        lastUpdated,
        imageUrl: imageError ? placeholderImage : imageUrl,
        description,
        sold_today,
        sold_1_month_ago,
        list_velocity,
      } 
    });
  };

  const handleImageError = (e) => {
    console.warn(`Failed to load image for product: ${name}`);
    setImageError(true);
    setIsLoading(false);
    e.target.src = placeholderImage;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const ratingPercentage = typeof rating === 'number' ? (rating * 20) : 0;
  const formattedPrice = price?.toFixed(2) || 'Price unavailable';

  return (
    <div 
      onClick={handleClick} 
      className="
        group flex flex-col h-full
        bg-card text-card-foreground
        rounded-xl overflow-hidden
        border border-border/50
        hover:border-border
        hover:shadow-lg hover:shadow-primary/5
        transform transition-all duration-200 ease-out
        cursor-pointer
      "
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageError ? placeholderImage : (imageUrl || placeholderImage)}
          alt={name}
          className={`
            w-full h-full object-cover object-center
            group-hover:scale-105 transition-transform duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          onError={handleImageError}
          onLoad={handleImageLoad}
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
        <div className="flex-grow space-y-1">
          <h3 className="font-medium text-foreground line-clamp-2">
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