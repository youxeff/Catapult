import React from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default ProductGrid;