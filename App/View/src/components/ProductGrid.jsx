import React from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <>
        {[...Array(6)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (!products || products.length === 0) {
    return <div className="no-results">No products found</div>;
  }

  return (
    <>
      {products.map((product, index) => (
        <ProductCard
          key={product.id || index}
          {...product}
        />
      ))}
    </>
  );
};

export default ProductGrid;