
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Prevents flickering issues
  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : loading ? null : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
