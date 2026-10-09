import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './NotFound.css';

function NotFound({
  heading = 'Page Not Found',
  message = 'The page you are looking for does not exist or may have been moved.',
  showContinue = true,
  continueText = 'Continue Shopping',
}) {
  useEffect(() => {
    document.title = `${heading} | Nike Store`;
  }, [heading]);
  return (
    <>
      <Navbar />

      <main className="not-found-page">
        <div className="not-found-card">
          <p className="not-found-code">404</p>
          <h1>{heading}</h1>
          <p className="not-found-message">{message}</p>

          <div className="not-found-actions">
            <Link to="/" className="not-found-btn primary">
              Back to Home
            </Link>
            {showContinue && (
              <Link to="/shop/all" className="not-found-btn secondary">
                {continueText}
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default NotFound;
