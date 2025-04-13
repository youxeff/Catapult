import React, { useState, useEffect, useRef } from 'react';

const sortOptions = [
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'price-low', label: 'Price: Low to High', icon: '↑' },
  { id: 'price-high', label: 'Price: High to Low', icon: '↓' }
];

const SortControls = ({ onSort, activeSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (sortId) => {
    onSort(sortId);
    setIsOpen(false);
  };

  const activeOption = sortOptions.find(opt => opt.id === activeSort);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2 rounded-lg
          bg-card text-card-foreground
          border border-border
          hover:bg-muted
          transition-all duration-200
          flex items-center gap-2
          min-w-[180px]
          justify-between
          ${isOpen ? 'ring-2 ring-primary/20' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <span>{activeOption?.icon}</span>
          <span>{activeOption?.label}</span>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[200px] py-2
          bg-card border border-border
          rounded-xl shadow-lg
          z-10"
        >
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                w-full px-4 py-2
                flex items-center gap-3
                text-left
                transition-colors duration-200
                ${activeSort === option.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-card-foreground hover:bg-muted'}
              `}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortControls;