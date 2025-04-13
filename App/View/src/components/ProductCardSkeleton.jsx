import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border/50 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full bg-muted" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-full w-3/4" />
          <div className="h-4 bg-muted rounded-full w-1/2" />
        </div>

        {/* Supplier */}
        <div className="h-3 bg-muted rounded-full w-1/3" />

        {/* Price and Rating */}
        <div className="space-y-2 pt-2">
          <div className="h-5 bg-muted rounded-full w-1/4" />
          <div className="flex items-center gap-2">
            <div className="h-1.5 bg-muted rounded-full flex-grow" />
            <div className="h-4 bg-muted rounded-full w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;