import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getProductById } from '../data/products';
import { addToCart } from '../utils/cart';
import { isInWishlist, toggleWishlist } from '../utils/wishlist';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [favorited, setFavorited] = useState(isInWishlist(id));

  const product = getProductById(id);

  const handleToggleWishlist = () => {
    if (!product) return;
    const { added } = toggleWishlist(product);
    setFavorited(added);
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="product-not-found">
          <h1>Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/" style={{ textDecoration: 'underline', fontWeight: 600 }}>
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const sizes = [6, 7, 8, 9, 10, 11];

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }

    addToCart(product, selectedSize, 1);
    setFeedback(`${product.name} (Size ${selectedSize}) added to your Bag!`);
    alert(`${product.name} (Size: ${selectedSize}) added to bag!`);
  };

  return (
    <>
      <Navbar />

      <main className="product-details">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <p className="product-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-price">{product.price}</p>

          <p className="product-description">
            {product.description}
          </p>

          <div className="size-section">
            <h3>Select Size</h3>

            <div className="sizes">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? 'selected-size' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="add-to-bag"
            onClick={handleAddToBag}
          >
            Add to Bag
          </button>

          <button
            type="button"
            className={`favourite-btn ${favorited ? 'active' : ''}`}
            onClick={handleToggleWishlist}
          >
            Favourite {favorited ? '♥' : '♡'}
          </button>

          {feedback && (
            <p style={{ marginTop: '14px', color: '#107c10', fontWeight: 600, fontSize: '14px' }}>
              ✓ {feedback}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProductDetails;