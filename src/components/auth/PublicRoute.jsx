import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * PublicRoute component ensures authenticated users are automatically
 * redirected away from Login/Signup to the dashboard.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard/invoices" replace />;
  }

  return children;
};

export default PublicRoute;
