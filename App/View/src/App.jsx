import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import ProductGrid from './components/ProductGrid'
import SortControls from './components/SortControls'
import GridNavigation from './components/GridNavigation'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeSort, setActiveSort] = useState('trending');
  const gridRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLastUpdated(new Date().toLocaleDateString());
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async ({ searchTerm, category }) => {
    if (!products.length) return;

    try {
      let results;
      if (category && category !== 'all') {
        const response = await fetch(`http://localhost:5000/api/products/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch category products');
        results = await response.json();
      } else {
        results = [...products];
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(product => 
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
        );
      }

      // Apply current sort
      sortProducts(results, activeSort);
    } catch (err) {
      console.error('Error during search:', err);
      setError('Search failed');
    }
  };

  const sortProducts = (productsToSort, sortType) => {
    const sorted = [...productsToSort].sort((a, b) => {
      switch (sortType) {
        case 'trending':
          return b.trendScore - a.trendScore;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
    setFilteredProducts(sorted);
  };

  const handleSort = (sortType) => {
    setActiveSort(sortType);
    sortProducts(filteredProducts, sortType);
  };

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleScroll = (direction) => {
    if (!gridRef.current) return;
    
    const scrollAmount = 300;
    const newScrollLeft = gridRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    gridRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const checkScroll = () => {
      if (!gridRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
      setCanScroll({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 10
      });
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, [products]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ThemeToggle />
          <SearchBar onSearch={handleSearch} />
          <div className="flex justify-between items-center my-8">
            <h2 className="text-6xl font-bold text-foreground">Top Picks</h2>
            {lastUpdated && (
              <span className="text-sm text-muted-foreground">
                Last Updated: {lastUpdated}
              </span>
            )}
          </div>
          <SortControls onSort={handleSort} activeSort={activeSort} />
          <div className="relative mt-6">
            <div className="overflow-x-auto" ref={gridRef}>
              <div className="flex gap-6 pb-6">
                <ProductGrid products={filteredProducts} loading={loading} />
              </div>
            </div>
            <GridNavigation 
              onScrollLeft={() => handleScroll('left')}
              onScrollRight={() => handleScroll('right')}
              canScrollLeft={canScroll.left}
              canScrollRight={canScroll.right}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
