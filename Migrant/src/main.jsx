import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import SelectAgency from "./pages/SelectAgency";
import AgencyLogin from "./pages/AgencyLogin";
import AgencySignup from "./pages/AgencySignup";
import SubmitComplaint from "./pages/SubmitComplaint";
import UserComplaints from "./pages/UserComplaints";
import AgencyDashboard from "./pages/AgencyDashboard";
import DepartmentLogin from "./pages/DepartmentLogin";
import DepartmentSignup from "./pages/DepartmentSignup";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import LandingPage from "./pages/LandingPage";
import GovLogin from "./pages/GovLogin";
import GovDashboard from "./pages/GovDashboard";
import NotFound from "./pages/NotFound";
import MigrantProtectedRoute from "./components/protectedRoutes/migrantUserPR";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />

      {/* Migrant Routes */}
      <Route
        path="/select-agency"
        element={
          <MigrantProtectedRoute>
            <SelectAgency />
          </MigrantProtectedRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <MigrantProtectedRoute>
            <Verification />
          </MigrantProtectedRoute>
        }
      />
      <Route
        path="/submit-complaint"
        element={
          <MigrantProtectedRoute>
            <SubmitComplaint />
          </MigrantProtectedRoute>
        }
      />
      <Route
        path="/user-complaints"
        element={
          <MigrantProtectedRoute>
            <UserComplaints />
          </MigrantProtectedRoute>
        }
      />

      {/* Sign In Routes */}
      <Route path="/signin/migrant" element={<Login />} />
      <Route path="/signin/agency" element={<AgencyLogin />} />
      <Route path="/signin/department" element={<DepartmentLogin />} />
      <Route path="/signin/government" element={<GovLogin />} />

      {/* Sign Up Routes */}
      <Route path="/signup/migrant" element={<Signup />} />
      <Route path="/signup/agency" element={<AgencySignup />} />
      <Route path="/signup/department" element={<DepartmentSignup />} />

      {/* Dashboard Routes */}
      <Route path="/agency-dashboard" element={<AgencyDashboard />} />
      <Route path="/department-dashboard" element={<DepartmentDashboard />} />
      <Route path="/government-dashboard" element={<GovDashboard />} />

      {/* Catch-all route for undefined URLs */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);
