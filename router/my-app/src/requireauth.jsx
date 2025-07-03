import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ isLogin, children }) {
  const location = useLocation();
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
export default RequireAuth;