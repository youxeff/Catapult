import React from 'react';

const SortControls = ({ onSort, activeSort }) => {
  return (
    <div className="flex gap-3 justify-center my-6">
      <button 
        className={`
          px-4 py-2 rounded-full text-sm
          border border-border
          transition-all duration-200
          ${activeSort === 'trending' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card text-card-foreground hover:bg-muted'}
        `}
        onClick={() => onSort('trending')}
      >
        Trending
      </button>
      <button 
        className={`
          px-4 py-2 rounded-full text-sm
          border border-border
          transition-all duration-200
          ${activeSort === 'price-low' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card text-card-foreground hover:bg-muted'}
        `}
        onClick={() => onSort('price-low')}
      >
        Price: Low to High
      </button>
      <button 
        className={`
          px-4 py-2 rounded-full text-sm
          border border-border
          transition-all duration-200
          ${activeSort === 'price-high' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card text-card-foreground hover:bg-muted'}
        `}
        onClick={() => onSort('price-high')}
      >
        Price: High to Low
      </button>
    </div>
  );
};

export default SortControls;