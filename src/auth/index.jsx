import { Navigate } from "react-router-dom";

import PropTypes from "prop-types";

const Auth = ({ children }) => {
  if (localStorage.getItem("token")) {
    return children;
  }

  return <Navigate to={"/login"} />;
};

Auth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Auth;
