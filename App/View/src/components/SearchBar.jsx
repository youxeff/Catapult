import React, { useState, useEffect, useRef } from 'react';

const categories = [
  { id: 'electronics', name: 'Electronics', icon: '🔌' },
  { id: 'clothing', name: 'Clothing & Apparel', icon: '👕' },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: '✨' },
  { id: 'home', name: 'Home & Kitchen', icon: '🏠' },
  { id: 'health', name: 'Health & Wellness', icon: '💪' },
  { id: 'sports', name: 'Sports & Outdoors', icon: '⚽' },
  { id: 'toys', name: 'Toys & Games', icon: '🎮' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'groceries', name: 'Groceries & Food', icon: '🥑' },
  { id: 'pets', name: 'Pet Supplies', icon: '🐾' }
];

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategories, setShowCategories] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch({
      searchTerm: debouncedSearchTerm,
      category: selectedCategory
    });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategories(false);
  };

  const selectedCategoryName = selectedCategory === 'all' 
    ? 'All Categories' 
    : categories.find(c => c.id === selectedCategory)?.name;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative" ref={dropdownRef}>
        <div className={`
          flex gap-2 p-2
          bg-card text-card-foreground
          border border-border
          rounded-xl
          transition-all duration-200
          ${showCategories ? 'ring-2 ring-primary/20' : ''}
        `}>
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-3 px-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for products..."
              className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category Selector */}
          <button 
            onClick={() => setShowCategories(!showCategories)}
            className={`
              px-4 py-2
              bg-muted/50 hover:bg-muted
              text-foreground
              rounded-lg
              flex items-center gap-2
              transition-colors duration-200
              min-w-[140px]
              justify-between
            `}
          >
            <span className="truncate">{selectedCategoryName}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={`w-5 h-5 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Categories Dropdown */}
        {showCategories && (
          <div className="absolute w-full mt-2 py-2 bg-card border border-border rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto">
            <div 
              className={`
                px-4 py-2 cursor-pointer
                flex items-center gap-3
                hover:bg-muted transition-colors
                ${selectedCategory === 'all' ? 'bg-primary/10 text-primary' : ''}
              `}
              onClick={() => selectCategory('all')}
            >
              🔍 All Categories
            </div>
            
            {categories.map(category => (
              <div
                key={category.id}
                className={`
                  px-4 py-2 cursor-pointer
                  flex items-center gap-3
                  hover:bg-muted transition-colors
                  ${selectedCategory === category.id ? 'bg-primary/10 text-primary' : ''}
                `}
                onClick={() => selectCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;