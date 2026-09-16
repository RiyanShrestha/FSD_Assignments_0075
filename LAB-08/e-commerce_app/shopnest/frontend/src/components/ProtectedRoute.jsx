import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useAuth();
  if (authLoading) return null;
  if (!isLoggedIn) return <Navigate to="/account" replace />;
  return children;
};
export default ProtectedRoute;
