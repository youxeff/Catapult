import React from 'react';

const GridNavigation = ({ onScrollLeft, onScrollRight, canScrollLeft, canScrollRight }) => {
  return (
    <div className="absolute inset-y-0 w-full flex items-center justify-between pointer-events-none">
      <button 
        className={`
          w-10 h-10 rounded-full
          bg-card/80 backdrop-blur-sm
          text-card-foreground
          border border-border
          flex items-center justify-center
          transition-all duration-200
          pointer-events-auto
          ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'}
        `}
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        ←
      </button>
      <button 
        className={`
          w-10 h-10 rounded-full
          bg-card/80 backdrop-blur-sm
          text-card-foreground
          border border-border
          flex items-center justify-center
          transition-all duration-200
          pointer-events-auto
          ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'}
        `}
        onClick={onScrollRight}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        →
      </button>
    </div>
  );
};

export default GridNavigation;