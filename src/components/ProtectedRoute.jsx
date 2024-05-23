import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const authData = JSON.parse(localStorage.getItem("auth-data"));
  const token = authData ? authData.access_token : null;

  return token ? element : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
