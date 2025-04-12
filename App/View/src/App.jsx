import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import ProductGrid from './components/ProductGrid'
import SortControls from './components/SortControls'
import GridNavigation from './components/GridNavigation'
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
              price: 4.05
            },
            {
              id: 'tech-002',
              image: 'https://via.placeholder.com/200',
              name: 'Wireless Earbuds',
              priceRange: '$ 29.99 - $ 35.99',
              trendScore: 88,
              categoryId: 'electronics'
            },
            {
              id: 'home-001',
              image: 'https://via.placeholder.com/200',
              name: 'Smart LED Bulb',
              priceRange: '$ 15.99 - $ 19.99',
              trendScore: 85,
              categoryId: 'home'
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
    <div className="app">
      <SearchBar onSearch={handleSort} />
      <div className="section-header">
        <h2 className="section-title">Top Picks</h2>
        {lastUpdated && (
          <span className="last-updated">Last Updated: {lastUpdated}</span>
        )}
      </div>
      <SortControls onSort={handleSort} activeSort={activeSort} />
      <div className="product-grid-container">
        <div className="product-grid" ref={gridRef}>
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
  )
}

export default App
