import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="product-card skeleton">
      <div className="product-image-container skeleton-image">
        <div className="skeleton-pulse"></div>
      </div>
      <div className="product-info">
        <div className="skeleton-text-short skeleton-pulse"></div>
        <div className="skeleton-text-long skeleton-pulse"></div>
        <div className="skeleton-score skeleton-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;