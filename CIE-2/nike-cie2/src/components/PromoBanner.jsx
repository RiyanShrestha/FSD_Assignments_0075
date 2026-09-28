import './PromoBanner.css';

function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="promo-content">
        <p className="promo-label">NIKE SPORTSWEAR</p>

        <h2>MAKE YOUR MOVE</h2>

        <p>
          Discover fresh styles designed for movement,
          comfort and everyday life.
        </p>

        <div className="promo-buttons">
          <button>Shop Men</button>
          <button>Shop Women</button>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;