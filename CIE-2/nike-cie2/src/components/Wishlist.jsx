import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getWishlist, removeFromWishlist } from '../utils/wishlist';
import './Wishlist.css';

function Wishlist() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getWishlist());

    const handleWishlistChange = () => {
      setItems(getWishlist());
    };

    window.addEventListener('wishlistChange', handleWishlistChange);
    window.addEventListener('storage', handleWishlistChange);

    return () => {
      window.removeEventListener('wishlistChange', handleWishlistChange);
      window.removeEventListener('storage', handleWishlistChange);
    };
  }, []);

  const handleRemove = (productId) => {
    const updated = removeFromWishlist(productId);
    setItems(updated);
  };

  return (
    <>
      <Navbar />

      <main className="wishlist-page">
        <div className="wishlist-header">
          <h1>Favourites</h1>
          <p>{items.length} Item{items.length === 1 ? '' : 's'}</p>
        </div>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your Wishlist is empty</h2>
            <p>
              Items added to your Favourites will be saved here so you can check back anytime.
            </p>
            <Link to="/shop/men" className="wishlist-shop-btn">
              Explore Shoes
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((item) => (
              <article key={item.id} className="wishlist-card">
                <Link
                  to={`/product/${item.id}`}
                  className="wishlist-image-container"
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                <div className="wishlist-card-content">
                  <h3 className="wishlist-product-name">{item.name}</h3>
                  <p className="wishlist-product-category">{item.category}</p>
                  <p className="wishlist-product-price">{item.price}</p>

                  <div className="wishlist-card-actions">
                    <Link
                      to={`/product/${item.id}`}
                      className="view-item-btn"
                    >
                      Select Size & Buy
                    </Link>
                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Wishlist;
