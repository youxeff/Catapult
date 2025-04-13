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
      {products.map((product) => {
        const {
          id,
          name,
          price,
          supplier,
          rating,
          lastUpdated,
          imageUrl,
          product_description,
          sold_today = 0,
          sold_1_month_ago = 0,
          list_velocity = 0
        } = product;

        return (
          <ProductCard
            key={id}
            id={id}
            name={name}
            price={price}
            supplier={supplier}
            rating={rating}
            lastUpdated={lastUpdated}
            imageUrl={imageUrl}
            description={product_description}
            sold_today={sold_today}
            sold_1_month_ago={sold_1_month_ago}
            list_velocity={list_velocity}
          />
        );
      })}
    </>
  );
};

export default ProductGrid;