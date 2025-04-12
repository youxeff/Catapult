import React, { useState, useEffect } from 'react';
import $ from 'jquery';

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing & Apparel' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'toys', name: 'Toys & Games' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'groceries', name: 'Groceries & Food' },
  { id: 'pets', name: 'Pet Supplies' },
  { id: 'office', name: 'Office & School Supplies' },
  { id: 'jewelry', name: 'Jewelry & Accessories' },
  { id: 'furniture', name: 'Furniture & Decor' },
  { id: 'tools', name: 'Tools & Hardware' },
  { id: 'books', name: 'Books & Media' },
  { id: 'baby', name: 'Baby Products' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'tech', name: 'Tech Gadgets' },
  { id: 'travel', name: 'Travel & Luggage' },
  { id: 'fitness', name: 'Fitness & Exercise Equipment' }
];

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategories, setShowCategories] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger search when debounced search term or category changes
  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm, selectedCategory]);

  const handleSearch = () => {
    onSearch({
      searchTerm: debouncedSearchTerm,
      category: selectedCategory
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategories(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2 bg-card border border-border rounded-lg p-2">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button 
          className="px-3 py-1 bg-muted text-muted-foreground rounded flex items-center gap-1 hover:bg-muted/80 transition-colors"
          onClick={() => setShowCategories(!showCategories)}
        >
          {selectedCategory === 'all' ? 'All Categories' : 
            categories.find(c => c.id === selectedCategory)?.name}
          <span className={`transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>
      
      {showCategories && (
        <div className="mt-2 bg-card border border-border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
          <div 
            className={`p-2 cursor-pointer hover:bg-muted transition-colors
              ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => selectCategory('all')}
          >
            All Categories
          </div>
          {categories.map(category => (
            <div
              key={category.id}
              className={`p-2 cursor-pointer hover:bg-muted transition-colors
                ${selectedCategory === category.id ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => selectCategory(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;