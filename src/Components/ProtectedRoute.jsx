import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ user, route, children }) => {
  if (!user) {
    return <Navigate to={route} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  user: PropTypes.string,
  route: PropTypes.string,
  children: PropTypes.node,
};

export default ProtectedRoute;


