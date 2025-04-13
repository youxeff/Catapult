import React from 'react';

const GridNavigation = ({ onScrollLeft, onScrollRight, canScrollLeft, canScrollRight }) => {
  return (
    <div className="absolute inset-y-0 w-full flex items-center justify-between pointer-events-none px-4">
      <button 
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className={`
          w-10 h-10
          flex items-center justify-center
          rounded-full
          bg-background/80
          backdrop-blur-sm
          border border-border
          text-foreground
          shadow-sm
          transition-all duration-200
          pointer-events-auto
          ${!canScrollLeft 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-muted hover:border-border/80 cursor-pointer'}
        `}
        aria-label="Scroll left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button 
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className={`
          w-10 h-10
          flex items-center justify-center
          rounded-full
          bg-background/80
          backdrop-blur-sm
          border border-border
          text-foreground
          shadow-sm
          transition-all duration-200
          pointer-events-auto
          ${!canScrollRight 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-muted hover:border-border/80 cursor-pointer'}
        `}
        aria-label="Scroll right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default GridNavigation;