import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/government/AnimatedBackground";
import Header from "../components/government/Header";
import StatisticsSection from "../components/government/StatisticsSection";
import AgencySection from "../components/government/AgencySection";

const GovDashboard = () => {
  const [agencies, setAgencies] = useState([]);
  const [allAgencies, setAllAgencies] = useState([]); // New state for all agencies (for stats)
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("unverified");
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [department, setDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("govToken");
    if (!token) {
      navigate("/signin/government");
      return;
    }

    // Fetch all agencies for statistics
    fetchAllAgencies();
    // Fetch filtered agencies for display
    fetchAgencies();
  }, [navigate]);

  // Fetch ALL agencies (for statistics)
  const fetchAllAgencies = async () => {
    try {
      const token = localStorage.getItem("govToken");
      const res = await axios.get(
        "http://localhost:5000/api/government/agencies",
        { headers: { "x-auth-token": token } }
      );
      setAllAgencies(res.data.agencies);
      updateStats(res.data.agencies);
    } catch (err) {
      console.error("Failed to fetch all agencies:", err);
    }
  };

  // Fetch filtered agencies (for display)
  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("govToken");
      const res = await axios.get(
        `http://localhost:5000/api/government/agencies?status=${statusFilter}&search=${searchTerm}`,
        { headers: { "x-auth-token": token } }
      );
      setAgencies(res.data.agencies);
    } catch (err) {
      console.error("Failed to fetch agencies:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (agencies) => {
    setStats({
      total: agencies.length,
      verified: agencies.filter((a) => a.isVerified).length,
      pending: agencies.filter((a) => !a.isVerified).length,
    });
  };

  const handleVerify = async (agencyId) => {
    try {
      const token = localStorage.getItem("govToken");
      await axios.put(
        `http://localhost:5000/api/government/agencies/${agencyId}`,
        { action: "verify" },
        { headers: { "x-auth-token": token } }
      );
      // Refresh both all agencies (for stats) and filtered agencies
      fetchAllAgencies();
      fetchAgencies();
    } catch (err) {
      console.error("Failed to verify agency:", err);
    }
  };

  const handleReject = async (agencyId) => {
    try {
      const token = localStorage.getItem("govToken");
      await axios.put(
        `http://localhost:5000/api/government/agencies/${agencyId}`,
        { action: "reject" },
        { headers: { "x-auth-token": token } }
      );
      // Refresh both all agencies (for stats) and filtered agencies
      fetchAllAgencies();
      fetchAgencies();
    } catch (err) {
      console.error("Failed to reject agency:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("govToken");
    navigate("/signin/government");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 transition-colors duration-500">
      <AnimatedBackground />
      <Header department={department} handleLogout={handleLogout} />

      <motion.main 
        className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 relative z-10 max-w-[98%] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatisticsSection stats={stats} />

        <AgencySection 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          fetchAgencies={fetchAgencies}
          agencies={agencies}
          loading={loading}
          handleVerify={handleVerify}
          handleReject={handleReject}
        />
      </motion.main>
      
      <footer className="py-6 px-6 text-center text-gray-500 text-sm mt-auto relative z-10">
        <p>© {new Date().getFullYear()} Government Migration Portal | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default GovDashboard;