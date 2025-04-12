import React from 'react';

const GridNavigation = ({ onScrollLeft, onScrollRight, canScrollLeft, canScrollRight }) => {
  return (
    <div className="grid-navigation">
      <button 
        className="nav-button"
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        ←
      </button>
      <button 
        className="nav-button"
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