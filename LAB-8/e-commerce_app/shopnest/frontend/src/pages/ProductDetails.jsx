import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import QuantitySelector from '../components/QuantitySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = () => {
    setLoading(true);
    setError('');
    getProductById(id)
      .then(data => {
        const prod = data.product || data;
        setProduct(prod);
        if (prod && prod.name) {
          document.title = `ShopNest | ${prod.name}`;
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Product not found');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading product..." />;

  if (error) {
    return (
      <div className="container mt-2">
        <ErrorMessage 
          title="Product Not Found"
          message={error}
          onRetry={fetchProduct}
        />
        <div className="text-center mt-2">
          <Link to="/products" className="btn btn-secondary">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      addToast(`Added ${quantity} × ${product.name} to cart`, 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="container product-details-page mt-2 mb-2">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/products" className="breadcrumb-link">Products</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-details-grid card">
        <div className="details-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="details-img"
            onError={handleImageError}
          />
        </div>

        <div className="details-info-container">
          <div className="details-header">
            <span className="category-badge">{product.category}</span>
            <h1 className="details-title">{product.name}</h1>
          </div>

          <div className="details-price-row">
            <span className="details-price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className={`stock-status ${
              isOutOfStock ? 'stock-out' : isLowStock ? 'stock-low' : 'stock-in'
            }`}>
              {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : '✓ In Stock'}
            </span>
          </div>

          <div className="details-stock-detail">
            <span>Availability: </span>
            <strong>{product.stock > 0 ? `${product.stock} items remaining` : 'Unavailable'}</strong>
          </div>

          <div className="details-description-box">
            <h4>Description</h4>
            <p>{product.description}</p>
          </div>

          <div className="details-actions">
            {!isOutOfStock ? (
              <div className="purchase-controls">
                <div className="qty-picker-label">Select Quantity:</div>
                <QuantitySelector 
                  quantity={quantity} 
                  maxStock={product.stock} 
                  onChange={setQuantity}
                />
                <button 
                  type="button" 
                  className="btn btn-primary btn-large mt-1" 
                  onClick={handleAddToCart}
                >
                  Add to Cart ({quantity})
                </button>
              </div>
            ) : (
              <div className="out-of-stock-banner">
                <p>⚠ This product is currently out of stock. Check back soon.</p>
                <button type="button" className="btn btn-primary" disabled>
                  Out of Stock
                </button>
              </div>
            )}

            <div className="details-links-row mt-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/products')}
              >
                ← Back to Products
              </button>
              <Link to="/cart" className="btn btn-secondary">
                Go to Cart →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
