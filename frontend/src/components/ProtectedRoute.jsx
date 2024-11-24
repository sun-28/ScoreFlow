import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import userContext from "../context/user/userContext";

const ProtectedRoute = ({ element, roles }) => {
  const { currUser } = useContext(userContext);

  if (!currUser) {
    return <Navigate to="/auth" />;
  }

  if (roles && !roles.includes(currUser.role)) {
    return <Navigate to="/tests" />;
  }

  return element;
};

export default ProtectedRoute;
