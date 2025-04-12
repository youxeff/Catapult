import React, { useState } from 'react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const handleSearch = () => {
    onSearch({ searchTerm, category: selectedCategory });
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    if (!showCategories) {
      setIsExpanded(false);
    }
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategories(false);
    if (!searchTerm) setIsExpanded(false);
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="search-bar">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
        <button 
          className="category-button"
          onClick={toggleCategories}
        >
          {selectedCategory === 'all' ? 'All Categories' : 
            categories.find(c => c.id === selectedCategory)?.name}
          <span className={`arrow ${showCategories ? 'up' : 'down'}`}>▼</span>
        </button>
      </div>
      
      {showCategories && (
        <div className="categories-dropdown">
          <div 
            className={`category-item ${selectedCategory === 'all' ? 'selected' : ''}`}
            onClick={() => selectCategory('all')}
          >
            All Categories
          </div>
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'selected' : ''}`}
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