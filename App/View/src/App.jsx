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
        // Simulating database data structure
        const mockData = {
          products: [
            {
              id: 'tech-001',
              image: 'https://via.placeholder.com/200',
              name: 'Fast Charger 40W',
              priceRange: '$ 4.05 - $ 5.00',
              trendScore: 92,
              categoryId: 'electronics',
              price: 4.05,
              description: 'High-speed charging adapter compatible with most devices'
            },
            {
              id: 'tech-002',
              image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1660803972361',
              name: 'AirPods Pro (2nd Gen)',
              priceRange: '$ 249.99',
              trendScore: 95,
              categoryId: 'electronics',
              price: 249.99,
              description: 'AirPods Pro (2nd generation) with USB-C charging case'
            },
            {
              id: 'home-001',
              image: 'https://via.placeholder.com/200',
              name: 'Smart LED Bulb',
              priceRange: '$ 15.99 - $ 19.99',
              trendScore: 85,
              categoryId: 'home',
              price: 15.99,
              description: 'WiFi-enabled smart LED bulb with millions of colors'
            }
          ],
          lastUpdated: new Date().toLocaleDateString()
        };
        
        setProducts(mockData.products);
        setLastUpdated(mockData.lastUpdated);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSort = (sortType) => {
    setActiveSort(sortType);
    const sortedProducts = [...products].sort((a, b) => {
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
    setProducts(sortedProducts);
  };

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
          <SearchBar onSearch={handleSort} />
          <div className="flex justify-between items-center my-8">
            <h2 className="text-2xl font-bold text-foreground">Top Picks</h2>
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
                <ProductGrid products={products} loading={loading} />
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
