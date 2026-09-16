import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const id = product.id;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, 1);
    if (res.success) {
      addToast(`Added ${product.name} to cart`, 'success');
    } else {
      addToast(res.message, 'warning');
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${id}`)}>
      <div className="product-image-wrap">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-img" 
          onError={handleImageError}
          loading="lazy"
        />
        <span className="category-badge">{product.category}</span>
      </div>

      <div className="product-content">
        <h3 className="product-title" title={product.name}>{product.name}</h3>
        
        <p className="product-desc">{product.description}</p>

        <div className="product-meta">
          <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          
          <span className={`stock-status ${
            isOutOfStock ? 'stock-out' : isLowStock ? 'stock-low' : 'stock-in'
          }`}>
            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : '✓ In Stock'}
          </span>
        </div>

        <div className="product-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            className="btn btn-secondary btn-flex" 
            onClick={() => navigate(`/products/${id}`)}
          >
            View Details
          </button>

          <button 
            type="button"
            className="btn btn-primary btn-flex" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Product is currently out of stock' : 'Add 1 item to cart'}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
