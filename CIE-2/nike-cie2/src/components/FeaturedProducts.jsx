import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const navigate = useNavigate();
  const featuredList = products.filter((p) => p.featured);

  return (
    <section className="featured-products">
      <div className="section-heading">
        <h2>Featured</h2>

        <button
          className="view-all-button"
          onClick={() => navigate('/shop/men')}
        >
          View All
        </button>
      </div>

      <div className="products-grid">
        {featuredList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;