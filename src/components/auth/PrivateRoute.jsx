import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component protects dashboard pages by verifying auth state,
 * redirecting unauthenticated users to /login.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
