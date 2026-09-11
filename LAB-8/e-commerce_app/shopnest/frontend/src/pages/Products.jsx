import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All Categories', 'Audio', 'Wearables', 'Accessories', 'Bags', 'Lighting'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dynamic document title
  useEffect(() => {
    document.title = 'ShopNest | Products';
  }, []);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('default');

  // Synchronize with URL query parameter ?category=...
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const fetchProducts = () => {
    setLoading(true);
    setError('');
    getProducts()
      .then(data => {
        const list = data.products || data;
        setProducts(list);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to load products.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All Categories') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSortBy('default');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const hasActiveFilters = selectedCategory !== 'All Categories' || searchTerm.trim() !== '';

  // Derive filtered and sorted products without mutating the original products array
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by Category
    if (selectedCategory !== 'All Categories') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 2. Filter by Search term (Name, Category, Description)
    if (searchTerm.trim() !== '') {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock-high-low':
        result.sort((a, b) => b.stock - a.stock);
        break;
      case 'default':
      default:
        // Keep initial API order (by ID)
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="container products-page mt-2 mb-2">
      <div className="products-page-header">
        <div>
          <h1 className="page-title">Explore Tech Collection</h1>
          <p className="page-subtitle">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Category Buttons, Sort Dropdown */}
      <div className="filter-panel card">
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input"
            placeholder="Search products by name, category, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          {searchTerm && (
            <button 
              type="button" 
              className="search-clear-btn" 
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-row">
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-wrap">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
              <option value="stock-high-low">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Enhancement 7: Active Filter Badges */}
        {hasActiveFilters && (
          <div className="active-filters-bar mt-1">
            <span className="active-filters-label">Active Filters:</span>
            {selectedCategory !== 'All Categories' && (
              <span className="filter-badge">
                Category: {selectedCategory}
                <button 
                  type="button" 
                  className="filter-badge-remove"
                  onClick={() => handleCategorySelect('All Categories')} 
                  aria-label="Remove category filter"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm.trim() !== '' && (
              <span className="filter-badge">
                "{searchTerm.trim()}"
                <button 
                  type="button" 
                  className="filter-badge-remove"
                  onClick={() => setSearchTerm('')} 
                  aria-label="Remove search filter"
                >
                  ×
                </button>
              </span>
            )}
            <button type="button" className="btn-reset-filters" onClick={handleClearFilters}>
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      {loading && <LoadingSpinner message="Loading products..." />}

      {error && (
        <ErrorMessage 
          title="Something went wrong."
          message={error}
          onRetry={fetchProducts}
        />
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <EmptyState 
          icon="🔍"
          title="No products found."
          message="Try another search or category."
          actionLabel="Clear Filters"
          onActionClick={handleClearFilters}
        />
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
