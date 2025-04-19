import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MigrantProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // List of routes that require full verification
  const protectedRoutes = ["/submit-complaint", "/user-complaints"];

  // List of routes that only require migrant verification (removed '/verify')
  const migrantOnlyRoutes = ["/select-agency"];

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/signin/migrant" state={{ from: location }} replace />;
  }

  // Check if the current route is in the protected routes list
  const isProtectedRoute = protectedRoutes.includes(location.pathname);
  const isMigrantOnlyRoute = migrantOnlyRoutes.includes(location.pathname);

  // If user is not a migrant, they can only access home and verification page
  if (!user.isMigrant) {
    if (location.pathname === "/verify") {
      return children; // Allow access to verification page
    }
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // If user is a migrant trying to access verify page
  if (user.isMigrant && location.pathname === "/verify") {
    alert("You are already verified as a migrant"); // Simple alternative
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // If user is a migrant but not agency verified
  if (!user.agencyVerified) {
    if (isProtectedRoute) {
      // Redirect to select-agency if trying to access protected routes
      return (
        <Navigate to="/select-agency" state={{ from: location }} replace />
      );
    }
    if (isMigrantOnlyRoute) {
      // Allow access to migrant-only routes
      return children;
    }
  }

  // For all other cases (verified migrant or non-protected routes)
  return children;
};

export default MigrantProtectedRoute;
