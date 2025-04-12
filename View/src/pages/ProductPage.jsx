import React from "react";

const product_data = {
  id: 1,
  name: "Sample Product",
  description: "This is a detailed description of the product.",
  price: 49.99,
  image: "https://via.placeholder.com/300",
  category: "Category",
};

const ProductPage = () => {
  const product = product_data;

  return (
    <div style={{ padding: "20px", backgroundColor: "#090909", position: "fixed", top: "10px", left: "10px", right: "10px", borderRadius: "20px", margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
      
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "10px", padding: "20px", backgroundColor: "#3f3f3f" }}>
          <div style={{ flex: 1, paddingRight: "10px", maxWidth: "200px" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: "10px" }} />
          </div>
          <div style={{ flex: 2, paddingLeft: "10px", color: "#fff" }}>
            <div style={{ fontSize: 30}}>{product.name}</div>
            <p>{product.description}</p>
          </div>
        </div>
        
        <div style={{ marginTop: "20px", overflowX: "auto", whiteSpace: "nowrap", borderRadius: "10px", backgroundColor: "#1a1a1a", padding: "10px" }}>
        <div style={{ fontSize: 20, textAlign:"left", paddingLeft: "10px", color: "#fff" }}>Listings</div>
          {Array(10).fill(product).map((item, index) => (
            <div
              key={index}
              style={{
          display: "inline-block",
          width: "200px",
          marginRight: "10px",
          backgroundColor: "#1a1a1a",
          borderRadius: "10px",
          padding: "10px",
          color: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
          src={item.image}
          alt={item.name}
          style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
              />
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{item.name}</div>
              <div style={{ fontSize: "14px", color: "#ccc" }}>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default ProductPage;
