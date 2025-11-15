// <<<<<<< HEAD
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedUserTypes }) => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("role"); // retrieve user_type
// =======
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children, allowedUserTypes }) => {
//   const token = localStorage.getItem('access_token');
//   const userType = localStorage.getItem('role'); // retrieve user_type
// >>>>>>> 959a3b8c4a74156b45156af0d3d74724bba9948b

  // Check if both token and allowed user type are valid
  const isAuthorized = token && allowedUserTypes.includes(userType);

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
