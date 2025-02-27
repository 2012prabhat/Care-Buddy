import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRoles = [], redirectPath = "/login" }) => {
    const { accessToken, user } = useContext(AuthContext);
    // Check if the user is authenticated
    useEffect(()=>{
        console.log("role is",user?.role)
    },[user])
    if (!accessToken) {
        // return <Navigate to={redirectPath} />;
    }

    // Check if the user has any of the required roles
    if (
        user && requiredRoles.length > 0 &&
        (!user || !user.role || !requiredRoles.includes(user.role))
    ) {
        return <Navigate to="/unauthorized" />;
    }

    // Render the protected content
    return children;
};

export default ProtectedRoute;
