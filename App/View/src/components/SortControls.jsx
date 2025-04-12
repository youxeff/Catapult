import React from 'react';

const SortControls = ({ onSort, activeSort }) => {
  return (
    <div className="sort-controls">
      <button 
        className={`sort-button ${activeSort === 'trending' ? 'active' : ''}`}
        onClick={() => onSort('trending')}
      >
        Trending
      </button>
      <button 
        className={`sort-button ${activeSort === 'price-low' ? 'active' : ''}`}
        onClick={() => onSort('price-low')}
      >
        Price: Low to High
      </button>
      <button 
        className={`sort-button ${activeSort === 'price-high' ? 'active' : ''}`}
        onClick={() => onSort('price-high')}
      >
        Price: High to Low
      </button>
    </div>
  );
};

export default SortControls;