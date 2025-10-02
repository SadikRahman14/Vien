import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const RequireAuth = ({ children, redirectTo = '/login' }) => {
  const { token } = useContext(ShopContext);
  const isLoggedIn = !!token && token !== 'null' && token !== 'undefined';
  return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
};

export default RequireAuth;
