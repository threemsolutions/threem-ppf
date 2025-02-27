import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: number[];
}) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const decodedToken: any = jwtDecode(token);
  if (!allowedRoles.includes(Number(decodedToken.RoleId))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
