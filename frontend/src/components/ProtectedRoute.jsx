import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import userContext from "../context/user/userContext";

const ProtectedRoute = ({ element }) => {
  const { currUser } = useContext(userContext);
  return currUser != null ? element : <Navigate to="/auth" />;
};

export default ProtectedRoute;
