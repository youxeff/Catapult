import React, { useState } from 'react';

const ListingCard = ({ 
  name,
  description,
  price,
  image,
  marketplace,
  marketplaceIcon,
  lastUpdated,
  url
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const placeholderImage = "https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1600";

  const handleImageError = (e) => {
    console.warn(`Failed to load image for listing: ${name}`);
    setImageError(true);
    setIsLoading(false);
    e.target.src = placeholderImage;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <img
          src={imageError ? placeholderImage : (image || placeholderImage)}
          alt={name}
          className={`
            w-full h-full object-cover 
            group-hover:scale-105 transition-transform duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium">
          {marketplaceIcon && !imageError && (
            <img 
              src={marketplaceIcon} 
              alt={marketplace} 
              className="w-4 h-4"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <span>{marketplace}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <h3 className="font-medium text-foreground line-clamp-2 mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-semibold text-foreground">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ListingCard;