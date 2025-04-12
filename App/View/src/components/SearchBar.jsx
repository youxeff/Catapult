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
    <div className={`max-w-2xl mx-auto p-4 ${isExpanded ? 'expanded' : ''}`}>
      <div className="flex gap-2 bg-card border border-border rounded-lg p-2">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="flex-1 bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button 
          className="px-3 py-1 bg-muted text-muted-foreground rounded flex items-center gap-1 hover:bg-muted/80 transition-colors"
          onClick={toggleCategories}
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