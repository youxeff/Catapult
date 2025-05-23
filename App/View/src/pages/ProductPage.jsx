import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SalesGraph from "../components/SalesGraph";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectedStats, setProjectedStats] = useState({
    lastValue: 0,
    projectedValue: 0,
    avgDailyChange: 0,
    totalChange: 0
  });
  
  const placeholderImage = "https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const product = location.state || {
    id: id,
    name: "Product Not Found",
    price: 0,
    supplier: "Unknown",
    rating: 0,
    lastUpdated: null,
    sold_today: 0,
    sold_1_month_ago: 0,
    list_velocity: 0,
    description: "No description available",
    imageUrl: null,
  };

  const [showPopup, setShowPopup] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  const handleTrackProduct = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  const handleAddToWishlist = () => {
    setShowWishlistPopup(true);
    setTimeout(() => setShowWishlistPopup(false), 3000); // Hide popup after 3 seconds
  };

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate projected revenue for next 30 days based on graph data
  const projectedRevenue = Math.round(projectedStats.projectedValue * product.price);
  
  // Calculate growth rate based on actual graph data
  const growthRate = projectedStats.lastValue > 0 
    ? Math.round((projectedStats.projectedValue - projectedStats.lastValue) / projectedStats.lastValue * 100)
    : 0;

  // Calculate market share change based on actual data
  const marketShareChange = projectedStats.totalChange > 0 
    ? Math.round((projectedStats.avgDailyChange / projectedStats.lastValue) * 100)
    : 0;

  const handleImageError = (e) => {
    console.warn(`Failed to load image for product: ${product.name}`);
    setImageError(true);
    setIsLoading(false);
    e.target.src = placeholderImage;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="relative">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Back to products"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <span className="text-sm text-muted-foreground">
                Back to Products
              </span>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={imageError ? placeholderImage : (product.imageUrl || placeholderImage)}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-semibold text-primary">
                    ${product.price?.toFixed(2)}
                  </span>
                  {product.rating >= 4.5 && (
                    <span className="px-2 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                      Trending
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Supplier</dt>
                    <dd className="font-medium text-foreground">
                      {product.supplier}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd className="font-medium text-foreground">
                      {formatDate(product.lastUpdated)}
                    </dd>
                  </div>
                  {product.rating && (
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground">Rating</dt>
                      <dd className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(product.rating / 5) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium text-foreground">
                          {product.rating.toFixed(1)}/5.0
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleTrackProduct}
                  className="w-full py-3 px-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Track Product
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="w-full py-3 px-8 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Performance Graph */}
            <div className="p-6 border border-border rounded-xl bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Sales Performance
              </h2>
              <SalesGraph
                curr={product.sold_today}
                prev={product.sold_1_month_ago}
                listVel={product.list_velocity}
              />
            </div>

            {/* Projected Stats */}
            <div className="p-6 border border-border rounded-xl bg-card">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Projected
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Revenue (30d)</span>
                    <span className="text-xl font-semibold text-foreground">
                      $23,492
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Growth Rate</span>
                    <span className="text-xl font-semibold text-green-500">
                      +24.3%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Market Share</span>
                    <span className="text-xl font-semibold text-primary">
                      12.8%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Trend Confidence
                    </span>
                    <span className="px-2 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                      High
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Popup Notifications */}
        {showPopup && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
            Product has been tracked
          </div>
        )}
        {showWishlistPopup && (
          <div className="fixed bottom-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg">
            Product added to wishlist
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
