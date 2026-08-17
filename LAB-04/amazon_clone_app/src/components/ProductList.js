import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import './ProductList.css';

function ProductList({ onAddToCart, searchQuery, selectedCategory, onSelectCategory }) {
  // Filter products based on search query and category
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory.toLowerCase() === 'all' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star-filled">★</span>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<span key={i} className="star-half">★</span>); // Custom CSS can overlay or we can just use ★ colored differently
      } else {
        stars.push(<span key={i} className="star-empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="product-list-container">
      {/* Hero Banner */}
      {!searchQuery && (
        <div className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Amazon Clone</h1>
            <p className="hero-subtitle">Shop the latest in tech, smart devices, and computer accessories with lightning-fast delivery.</p>
            <button className="hero-btn" onClick={() => onSelectCategory('All')}>Explore Catalog</button>
          </div>
        </div>
      )}

      {/* Category Pills / Navigation inside ProductList */}
      <div className="category-section">
        <h3 className="section-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory} Products` : 'All Products'}
        </h3>
        <span className="results-count">{filteredProducts.length} items found</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <span className="no-products-icon">🔍</span>
          <h3>No products match your search.</h3>
          <p>Try checking your spelling or using more general terms.</p>
          <button className="back-home-btn" onClick={() => {
            onSelectCategory('All');
            // Reset query (handled by parent through setting state, we can trigger resets)
            window.location.reload(); // simple fallback or trigger prop
          }}>Clear filters</button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-rating">
                    <div className="stars-container">{renderStars(product.rating)}</div>
                    <span className="rating-value">{product.rating}</span>
                  </div>
                  <div className="product-price-row">
                    <span className="price-symbol">$</span>
                    <span className="price-whole">{Math.floor(product.price)}</span>
                    <span className="price-fraction">{(product.price % 1).toFixed(2).substring(2)}</span>
                    {product.inStock ? (
                      <span className="badge-prime">✓ prime</span>
                    ) : (
                      <span className="badge-out">Out of stock</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="product-actions">
                <button 
                  className="add-to-cart-btn" 
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Temporarily Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
