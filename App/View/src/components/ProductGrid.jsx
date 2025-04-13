import React from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGrid = ({ products, loading }) => {
  console.log('ProductGrid received:', { products, loading }); // Debug log

  if (loading) {
    console.log('ProductGrid: Showing loading state');
    return (
      <>
        {[...Array(6)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (!products || products.length === 0) {
    console.log('ProductGrid: No products found'); // Debug log
    return <div className="no-results">No products found</div>;
  }

  console.log('ProductGrid: Rendering products:', products); // Debug log
  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </>
  );
};

export default ProductGrid;