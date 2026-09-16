import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    document.title = 'ShopNest | Page Not Found';
  }, []);

  return (
  <div className="container not-found-page mt-2 mb-2 text-center">
    <div className="not-found-card card mx-auto">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-desc">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-2">
        Back to Home
      </Link>
    </div>
  </div>
  );
};

export default NotFound;
