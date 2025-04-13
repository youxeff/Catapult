import React, { useState } from 'react';

const SortControls = ({ onSort, activeSort, category = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { id: 'trending', label: 'Trending' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' }
  ];

  const handleSelect = (sortId) => {
    onSort(sortId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg text-sm
          bg-card text-card-foreground
          border border-border
          hover:bg-muted
          transition-all duration-200
          flex items-center gap-2"
      >
        <span>Sort by: {sortOptions.find(opt => opt.id === activeSort)?.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
        >
          <path 
            fill="currentColor" 
            d="M7 10l5 5 5-5z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 z-10
          bg-card border border-border rounded-lg shadow-lg
          py-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left px-4 py-2
                ${activeSort === option.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-card-foreground hover:bg-muted'}
                transition-colors duration-200`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortControls;