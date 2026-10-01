import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { products } from '../data/products';
import './ShopPage.css';

function ShopPage() {
  const { category = 'all' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('default');

  // Keep search input in sync if URL query parameter changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const normalizedCategory = category.toLowerCase();

  // 1. Filter by category
  const baseCategoryProducts = useMemo(() => {
    if (normalizedCategory === 'men') {
      return products.filter((p) => p.gender === 'men');
    }
    if (normalizedCategory === 'women') {
      return products.filter((p) => p.gender === 'women');
    }
    // 'all', 'sale', etc.
    return products;
  }, [normalizedCategory]);

  // 2. Filter by search query and sort by price
  const filteredProducts = useMemo(() => {
    let result = [...baseCategoryProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.priceNumber || 0) - (b.priceNumber || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.priceNumber || 0) - (a.priceNumber || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [baseCategoryProducts, searchQuery, sortBy]);

  const title =
    normalizedCategory === 'all'
      ? 'All Shoes'
      : normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1);

  return (
    <>
      <Navbar />

      <main className="shop-page">
        <div className="shop-header">
          <h1>{title}</h1>

          <p>
            Explore the latest{' '}
            {normalizedCategory === 'all' ? '' : normalizedCategory}{' '}
            styles designed for movement and everyday life.
          </p>
        </div>

        <div className="shop-toolbar">
          <span className="shop-count">
            {filteredProducts.length} Product{filteredProducts.length === 1 ? '' : 's'}
          </span>

          <div className="shop-controls">
            <input
              type="text"
              className="shop-search-input"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val) {
                  setSearchParams({ search: val });
                } else {
                  setSearchParams({});
                }
              }}
            />

            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by price or name"
            >
              <option value="default">Sort By: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <section className="shop-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>We couldn't find any products matching your search criteria.</p>
              <button
                type="button"
                className="clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                  setSortBy('default');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article className="shop-product">
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
              </Link>
            ))
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ShopPage;