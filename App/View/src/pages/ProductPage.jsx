import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SalesGraph from "../components/SalesGraph";
import ListingCard from "../components/ListingCard";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const product = location.state || {
    id: id,
    name: "Sample Product",
    description: "This is a detailed description of the product.",
    priceRange: "$0.00 - $0.00",
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.gelighting.com%2Fsmart-home%2Fled-bulbs%2Ffull-color&psig=AOvVaw3ANa-TiFyKBYfYDvxAY3LB&ust=1744580511777000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJiSvIC704wDFQAAAAAdAAAAABAR",
    trendScore: 0,
    category: "Category",
    sellers: ["Seller Name"],
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto relative">
        <div className="mt-16 bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 flex gap-4">
            <div className="flex flex-col">
              <button
                onClick={() => navigate("/")}
                className="-left-4 top-0 px-4 py-2 flex-none items-center gap-2 text-sm
            bg-card hover:bg-muted text-card-foreground
            rounded-lg
            transition-colors duration-200"
              >
                <span>←</span>
              </button>
            </div>

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
              <p className="text-primary text-xl mb-6">{product.priceRange}</p>
              {product.trendScore && (
                <div className="mt-4">
                  <span className="text-muted-foreground block mb-2">
                    Trend Score: {product.trendScore}%
                  </span>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${product.trendScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(product.sellers ? product.sellers.length : 4)
              .fill({ ...product, id: undefined })
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-4
                  hover:bg-muted transition-colors duration-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-medium text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-primary">{item.priceRange}</p>
                  <p className="text-muted-foreground mt-2">{item.sellers[index]}</p>
                </div>
              ))}
          </div>
        </div>
        <SalesGraph />
      </div>
    </div>
  );
};

export default ProductPage;
