import { useState, useEffect } from 'react'
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

  const handleSearch = async ({ searchTerm, category, results }) => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (results) {
        // Combine products from all sources
        const allProducts = [
          ...(results.products?.amazon || []),
          ...(results.products?.aliexpress || []),
          ...(results.products?.cj || [])
        ];

        // Update filtered products
        if (allProducts.length > 0) {
          setFilteredProducts(allProducts);
        } else {
          // If no results from unified search, fall back to local filtering
          const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.supplier && category !== 'all' && 
             product.supplier.toLowerCase() === category.toLowerCase())
          );
          setFilteredProducts(filtered);
        }

        // Update last updated timestamp
        setLastUpdated(new Date().toLocaleDateString());
      }
    } catch (err) {
      console.error('Error during search:', err);
      setError('Search failed');
      setFilteredProducts(products); // Fallback to all products
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (sortType) => {
    setActiveSort(sortType);
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortType) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'trending':
          return (b.list_velocity || 0) - (a.list_velocity || 0);
        default:
          return 0;
      }
    });
    setFilteredProducts(sorted);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavigationBar />
        
        <main className="max-w-[1400px] mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="max-w-3xl mx-auto mb-8">
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
                <SortControls activeSort={activeSort} onSort={handleSort} />
              </div>

              {error && (
                <div className="text-destructive text-center py-4">
                  {error}
                </div>
              )}

              <div className="w-full">
                <ProductGrid 
                  products={filteredProducts}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
