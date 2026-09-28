import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{product.price}</p>
      </div>
    </article>
  );
}

export default ProductCard;