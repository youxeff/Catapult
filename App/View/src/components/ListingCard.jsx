import React from 'react';
import { useState, useEffect } from 'react';

const ListingCard = ({ product_id, seller }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://api.example.com/products/${product_id}:${seller}`);
        const data = await response.json();
        setProductDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product_id, seller]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { name, description, price, image } = productDetails;

  return (
    <div className="listing-card" style={styles.card}>
      <img src={image} alt={name} style={styles.image} />
      <div style={styles.content}>
        <h2 style={styles.name}>{name}</h2>
        <p style={styles.description}>{description}</p>
        <p style={styles.price}>${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '300px',
    margin: '16px',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '16px',
  },
  name: {
    fontSize: '1.5rem',
    margin: '0 0 8px',
  },
  description: {
    fontSize: '1rem',
    color: '#555',
    margin: '0 0 16px',
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default ListingCard;