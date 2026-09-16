import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchFeaturedProducts = () => {
    setLoading(true);
    setError('');
    getProducts()
      .then(data => {
        const prods = data.products || data;
        setFeatured(prods.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to load products');
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = 'ShopNest | Home';
    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Audio', icon: '🎧', desc: 'Headphones & Speakers' },
    { name: 'Wearables', icon: '⌚', desc: 'Watches & Trackers' },
    { name: 'Accessories', icon: '⌨️', desc: 'Keyboards, Mice & Hubs' },
    { name: 'Bags', icon: '🎒', desc: 'Backpacks & Sleeves' },
    { name: 'Lighting', icon: '💡', desc: 'Smart & LED Lamps' }
  ];

  const handleCategoryClick = (catName) => {
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">🚀 Next-Gen Tech Store</span>
            <h1 className="hero-heading">Welcome to <span className="text-highlight">ShopNest</span></h1>
            <p className="hero-subtext">
              Curated tech essentials, accessories, and daily drivers built to elevate your productivity and lifestyle.
            </p>
            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-hero">
                Shop Now →
              </Link>
              <Link to="/account" className="btn btn-hero-secondary">
                My Account
              </Link>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="hero-card-preview">
              <div className="preview-stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic Gear</span>
              </div>
              <div className="preview-stat">
                <span className="stat-number">₹0</span>
                <span className="stat-label">Free Delivery &gt; ₹2000</span>
              </div>
              <div className="preview-stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Fast Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Intro Bar */}
      <section className="features-bar">
        <div className="container features-grid">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <h4>Express Dispatch</h4>
              <p>Quick processing on all orders</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <div>
              <h4>Verified Quality</h4>
              <p>1-year official brand warranty</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <div>
              <h4>Hassle-Free Returns</h4>
              <p>7-day replacement policy</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💳</span>
            <div>
              <h4>Secure Checkout</h4>
              <p>Backend-verified calculation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-featured container mt-2">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Top-rated tech accessories handpicked for you</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-small">
            View All Products &rarr;
          </Link>
        </div>

        {loading && <LoadingSpinner message="Loading featured products..." />}
        
        {error && (
          <ErrorMessage 
            title="Unable to load products"
            message={error}
            onRetry={fetchFeaturedProducts}
          />
        )}

        {!loading && !error && (
          <div className="product-grid">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="section-categories container mt-2 mb-2">
        <div className="section-header text-center">
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">Find exactly what you need by product family</p>
        </div>

        <div className="categories-grid">
          {categories.map(cat => (
            <div 
              key={cat.name} 
              className="category-card" 
              onClick={() => handleCategoryClick(cat.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.desc}</p>
              <span className="category-arrow">Explore →</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
