import React from 'react';
import { Link } from 'react-router-dom';
import './RecommendedProducts.css';

const RECOMMENDATIONS = [
  {
    id: 101,
    name: "Wireless Charging Pad",
    rating: 4.3,
    price: 15.99,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400&q=80"
  },
  {
    id: 102,
    name: "USB-C Hub Multiport Adapter",
    rating: 4.6,
    price: 24.99,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80"
  },
  {
    id: 103,
    name: "Bluetooth Portable Speaker",
    rating: 4.5,
    price: 29.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80"
  },
  {
    id: 104,
    name: "Adjustable Laptop Stand",
    rating: 4.8,
    price: 19.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80"
  }
];

function RecommendedProducts({ onAddToCart }) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '★';
      } else {
        stars += '☆';
      }
    }
    return stars;
  };

  return (
    <div className="recommendations-container">
      <h2 className="recommendations-title">
        Customers who viewed items in your cart also viewed
      </h2>
      <div className="recommendations-grid">
        {RECOMMENDATIONS.map((product) => (
          <div key={product.id} className="recommendation-card">
            <Link to={`/product/${product.id}`} className="rec-link">
              <div className="rec-image-container">
                <img src={product.image} alt={product.name} className="rec-image" />
              </div>
              <div className="rec-details">
                <h4 className="rec-name">{product.name}</h4>
                <div className="rec-rating">
                  <span className="stars-label">{renderStars(product.rating)}</span>
                  <span className="rating-val">{product.rating}</span>
                </div>
                <div className="rec-price">${product.price.toFixed(2)}</div>
              </div>
            </Link>
            <button 
              className="add-to-cart-btn" 
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedProducts;
export { RECOMMENDATIONS };

