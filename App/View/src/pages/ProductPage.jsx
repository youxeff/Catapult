import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SalesGraph from "../components/SalesGraph";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const product = location.state || {
    id: id,
    name: "Product Not Found",
    description: "This product could not be found.",
    priceRange: "N/A",
    image: "https://via.placeholder.com/400",
    trendScore: 0,
    category: "Unknown",
    sellers: ["Unknown"],
    price: 0,
    rating: 0,
    lastUpdated: null
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto relative">
        <div className="mt-16 bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 flex gap-4">
            <div className="flex flex-col">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 flex items-center gap-2 text-sm
                  bg-card hover:bg-muted text-card-foreground
                  rounded-lg transition-colors duration-200"
              >
                <span>← Back to Products</span>
              </button>
            </div>

            <div className="flex-grow flex gap-8">
              <div className="flex-none w-48 h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <p className="text-primary text-xl mb-4">{product.priceRange}</p>
                <p className="text-muted-foreground mb-4">
                  Supplier: {product.category}
                </p>
                {product.lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    Last Updated: {new Date(product.lastUpdated).toLocaleString()}
                  </p>
                )}
                {product.rating && (
                  <div className="mt-6">
                    <span className="text-muted-foreground block mb-2">
                      Rating: {product.rating.toFixed(1)}/5.0
                    </span>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(product.rating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Sales Performance
          </h2>
          <SalesGraph />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
