import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './ShopPage.css';

const products = {
  men: [
    {
      name: 'Air Motion Runner',
      category: 'Men’s Shoes',
      price: '₹12,995',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Street Court',
      category: 'Men’s Shoes',
      price: '₹10,495',
      image:
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Everyday Trainer',
      category: 'Men’s Shoes',
      price: '₹11,995',
      image:
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Performance Runner',
      category: 'Men’s Shoes',
      price: '₹13,995',
      image:
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80',
    },
  ],

  women: [
    {
      name: 'Air Motion',
      category: 'Women’s Shoes',
      price: '₹11,995',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Court Vision',
      category: 'Women’s Shoes',
      price: '₹10,995',
      image:
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Runner Pro',
      category: 'Women’s Shoes',
      price: '₹13,995',
      image:
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Everyday Move',
      category: 'Women’s Shoes',
      price: '₹12,495',
      image:
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=80',
    },
  ],
};

function ShopPage() {
  const { category } = useParams();

  const categoryProducts = products[category] || products.men;

  const title =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <Navbar />

      <main className="shop-page">
        <div className="shop-header">
          <h1>{title}</h1>

          <p>
            Explore the latest {category} styles designed for
            movement and everyday life.
          </p>
        </div>

        <div className="shop-toolbar">
          <span>{categoryProducts.length} Products</span>

          <button>Filter & Sort</button>
        </div>

        <section className="shop-grid">
          {categoryProducts.map((product, index) => (
            <article className="shop-product" key={index}>
              <div className="shop-product-image">
                <img
                  src={product.image}
                  alt={product.name}
                />
              </div>

              <div className="shop-product-info">
                <h2>{product.name}</h2>
                <p>{product.category}</p>
                <strong>{product.price}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ShopPage;