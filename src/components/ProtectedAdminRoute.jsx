import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedAdminRoute = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedAdminRoute;
