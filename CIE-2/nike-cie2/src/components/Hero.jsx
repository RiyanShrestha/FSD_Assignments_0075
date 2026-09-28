import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">JUST IN</p>

        <h1>
          MOVE
          <br />
          YOUR WAY
        </h1>

        <p className="hero-description">
          Discover new styles made for movement, comfort and everyday life.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate('/shop/men')}>
            Shop Men
          </button>

          <button onClick={() => navigate('/shop/women')}>
            Shop Women
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;