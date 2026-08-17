import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import './ProductDetails.css';

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Find the current product
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="back-home-link">Back to Home Page</Link>
      </div>
    );
  }

  // Handle Add to Cart with selected quantity
  const handleAddToCartWithQty = () => {
    // We can call onAddToCart multiple times or adapt onAddToCart to accept quantity.
    // Let's call onAddToCart(product) quantity times.
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  // Buy Now immediately triggers checkout
  const handleBuyNow = () => {
    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    // Navigate to checkout page
    navigate('/checkout');
  };

  // Get similar products (in same category, excluding current product)
  const similarProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star-filled">★</span>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<span key={i} className="star-half">★</span>);
      } else {
        stars.push(<span key={i} className="star-empty">☆</span>);
      }
    }
    return stars;
  };

  // Mock shipping estimation
  const getDeliveryDate = () => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 3);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return delivery.toLocaleDateString('en-US', options);
  };

  const getFastestDeliveryDate = () => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 1);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return delivery.toLocaleDateString('en-US', options);
  };

  return (
    <div className="product-details-container">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link to="/">Catalog</Link> &gt; <span>{product.category}</span> &gt; <span className="current-crumb">{product.name}</span>
      </nav>

      {/* Main product view grid */}
      <div className="product-details-layout">
        
        {/* Left Column: Image */}
        <div className="details-image-section">
          <div className="image-zoom-box">
            <img src={product.image} alt={product.name} className="details-main-img" />
          </div>
          <span className="image-caption">Hover to zoom image</span>
        </div>

        {/* Center Column: Title & Info */}
        <div className="details-info-section">
          <h1 className="details-title">{product.name}</h1>
          <span className="details-brand">Brand: Amazon Clone Essentials</span>
          
          <div className="details-rating-row">
            <div className="stars-container">{renderStars(product.rating)}</div>
            <span className="rating-text">{product.rating} out of 5 stars</span>
          </div>

          <hr className="details-divider" />

          <div className="details-price-block">
            <span className="price-label">Price:</span>
            <div className="price-value-container">
              <span className="details-price">${product.price.toFixed(2)}</span>
              {product.inStock && <span className="details-prime-badge">✓ prime & Free Returns</span>}
            </div>
          </div>

          <div className="features-card">
            <h4>About this item:</h4>
            <p className="product-desc">{product.description}</p>
            <ul className="features-list">
              {product.features && product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Buy Widget Card */}
        <div className="details-buy-widget">
          <div className="buy-widget-card">
            <span className="widget-price">${product.price.toFixed(2)}</span>
            <div className="widget-prime-text">
              <span className="badge-prime">✓ prime</span> FREE delivery <b>{getDeliveryDate()}</b>.
            </div>
            <div className="widget-fastest-text">
              Or fastest delivery <b>Tomorrow, {getFastestDeliveryDate()}</b>. Order within <span className="time-remaining">4 hrs 12 mins</span>.
            </div>

            <div className="widget-stock-status">
              {product.inStock ? (
                <span className="stock-in">In Stock</span>
              ) : (
                <span className="stock-out">Temporarily Out of Stock</span>
              )}
            </div>

            {product.inStock && (
              <>
                <div className="widget-qty-selector">
                  <label htmlFor="widget-qty">Qty:</label>
                  <select 
                    id="widget-qty" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <button className="widget-add-btn" onClick={handleAddToCartWithQty}>
                  Add to Cart
                </button>

                <button className="widget-buy-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </>
            )}

            {addedMessage && (
              <div className="added-success-alert">
                <span className="check-icon">✓</span> Added to Cart!
              </div>
            )}

            <hr className="widget-divider" />
            <div className="widget-secure">
              <span className="lock-icon">🔒</span> Secure transaction
            </div>
            <div className="widget-ships-sold">
              <div><span className="label">Ships from:</span><span> Amazon.clone</span></div>
              <div><span className="label">Sold by:</span><span> Amazon.clone Essentials</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Column: Similar Products */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h3 className="similar-title">Compare with similar items</h3>
          <div className="similar-grid">
            {similarProducts.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="similar-card">
                <div className="similar-img-wrapper">
                  <img src={p.image} alt={p.name} className="similar-img" />
                </div>
                <div className="similar-info">
                  <span className="similar-name">{p.name}</span>
                  <div className="similar-stars">{renderStars(p.rating)}</div>
                  <span className="similar-price">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
