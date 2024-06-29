import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
        console.log("ajsdfhklasdfkjafdhlakjfha")
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/admin-home/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);


      } finally {
        setLoading(false);

      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
