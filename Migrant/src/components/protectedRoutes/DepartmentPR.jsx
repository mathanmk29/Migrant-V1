import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const DepartmentProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("deptToken");
  const departmentName = localStorage.getItem("departmentName");

  if (!token || !departmentName) {
    // Redirect to department login if no token or department name is found
    return (
      <Navigate to="/signin/department" state={{ from: location }} replace />
    );
  }

  return children;
};

export default DepartmentProtectedRoute;
