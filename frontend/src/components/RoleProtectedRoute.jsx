// src/components/RoleProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    console.log('🔒 RoleProtectedRoute - Check access:');
    console.log('   Loading:', loading);
    console.log('   Authenticated:', isAuthenticated);
    console.log('   User:', user);
    console.log('   User Role:', user?.role);
    console.log('   Allowed Roles:', allowedRoles);
    console.log('   Current Path:', location.pathname);

    // Dacă încă se încarcă, afișăm loading
    if (loading) {
        console.log('🔄 RoleProtectedRoute - Still loading, showing spinner');
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Se încarcă...</span>
                </div>
            </div>
        );
    }

    // Dacă nu este autentificat, redirecționează la login
    if (!isAuthenticated) {
        console.log('❌ RoleProtectedRoute - Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Dacă nu avem user object, redirecționează la login
    if (!user) {
        console.log('❌ RoleProtectedRoute - No user object, redirecting to login');
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Verifică dacă utilizatorul are rolul necesar
    const userRole = user.role;
    const hasPermission = allowedRoles.includes(userRole);

    console.log('🔍 RoleProtectedRoute - Permission check:');
    console.log('   User Role:', userRole);
    console.log('   Role Type:', typeof userRole);
    console.log('   Allowed Roles:', allowedRoles);
    console.log('   Has Permission:', hasPermission);

    if (!hasPermission) {
        console.log('❌ RoleProtectedRoute - Access denied, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    console.log('✅ RoleProtectedRoute - Access granted, rendering children');
    return children;
};

export default RoleProtectedRoute;