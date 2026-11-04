import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedUserTypes }) => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("role");
  const isAllowed = token && (!allowedUserTypes || allowedUserTypes.includes(userType));
  return isAllowed ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
