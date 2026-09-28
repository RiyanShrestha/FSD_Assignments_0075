import ProductCard from './ProductCard';
import './FeaturedProducts.css';

const products = [
  {
    id: 1,
    name: 'Air Max Dn8',
    category: "Men's Shoes",
    price: '₹14,995',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Air Force Style',
    category: "Women's Shoes",
    price: '₹11,495',
    image:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Runner Pro',
    category: 'Running Shoes',
    price: '₹13,995',
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Court Vision',
    category: 'Basketball Shoes',
    price: '₹10,995',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
  },
];

function FeaturedProducts() {
  return (
    <section className="featured-products">
      <div className="section-heading">
        <h2>Featured</h2>

        <button className="view-all-button">
          View All
        </button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
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