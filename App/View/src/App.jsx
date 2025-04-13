import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import ProductGrid from './components/ProductGrid'
import SortControls from './components/SortControls'
import NavigationBar from './components/NavigationBar'
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
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
        const response = await fetch(`http://localhost:5001/api/products/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch category products');
        results = await response.json();
      } else {
        results = [...products];
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(product => 
          product.name.toLowerCase().includes(term) ||
          (product.supplier && product.supplier.toLowerCase().includes(term))
        );
      }

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
          return (b.rating || 0) - (a.rating || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        <div className="relative">
          <NavigationBar />
          <ThemeToggle />
          
          <main className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                Discover Trending Products
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find the next big thing before everyone else. Our AI-powered platform helps you identify trending products across all marketplaces.
              </p>
            </div>

            {/* Search Section */}
            <div className="mb-12">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Products Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Top Picks</h2>
                  {lastUpdated && (
                    <span className="text-sm text-muted-foreground">
                      Last Updated: {lastUpdated}
                    </span>
                  )}
                </div>
                <SortControls onSort={handleSort} activeSort={activeSort} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductGrid products={filteredProducts.map(p => ({
                  ...p,
                  description: p.product_description || 'No description available'
                }))} loading={loading} />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center">
                  {error}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
