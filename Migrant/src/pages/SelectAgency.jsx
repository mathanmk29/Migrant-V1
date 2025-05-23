import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight,
  FiUser,
  FiClock,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiMail,
} from "react-icons/fi";
import AuthHeader from "../components/user/AuthHeader";

const SelectAgency = () => {
  const [agencies, setAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [expandedAgency, setExpandedAgency] = useState(null);

  const toggleAgencyExpansion = (agencyId) => {
    setExpandedAgency(expandedAgency === agencyId ? null : agencyId);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/signin/migrant");

        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/signin/migrant");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/agency/agencies"
        );
        setAgencies(res.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load agencies. Please try again.");
        setIsLoading(false);
        console.error("Error fetching agencies:", error);
      }
    };

    fetchAgencies();
  }, []);

  const handleSelect = (agency) => {
    setSelectedAgency(agency);
    setIsConfirmOpen(true);
  };

  const confirmSelection = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        "http://localhost:5000/api/agency/request-verification",
        {
          userId,
          agencyId: selectedAgency._id,
        }
      );
      setIsConfirmOpen(false);
      navigate("/home", {
        state: {
          success: `Verification request sent to ${selectedAgency.name}!`,
        },
      });
    } catch (error) {
      setError("Failed to send request. Please try again.");
      console.error("Error requesting verification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AuthHeader user={user} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Select Verification Agency
                </h1>
                <p className="text-gray-600 mt-2">
                  Choose a government agency to verify your migrant status
                </p>
              </div>
              {user?.agency && (
                <div className="mt-4 md:mt-0 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Current agency:{" "}
                        <span className="font-medium">{user.agency.name}</span>{" "}
                        ({user.agencyVerified ? "Verified" : "Pending"})
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Agencies List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : agencies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {agencies.map((agency) => (
              <motion.div
                key={agency._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                      <FiShield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">
                          {agency.name}
                        </h3>
                        <button
                          onClick={() => toggleAgencyExpansion(agency._id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {expandedAgency === agency._id ? (
                            <FiChevronUp className="h-5 w-5" />
                          ) : (
                            <FiChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {agency.description || "Government verification agency"}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Agency Details */}
                  <AnimatePresence>
                    {expandedAgency === agency._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4"
                      >
                        <div className="border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                <FiPhone className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">
                                  Phone
                                </p>
                                <p className="text-sm text-gray-800 mt-1">
                                  {agency.phoneNumber || "Not provided"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                <FiMapPin className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">
                                  Address
                                </p>
                                <p className="text-sm text-gray-800 mt-1">
                                  {agency.location || "Not specified"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                <FiBriefcase className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">
                                  Department
                                </p>
                                <p className="text-sm text-gray-800 mt-1">
                                  {agency.department || "Not specified"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="bg-blue-50 p-2 rounded-lg">
                                {agency.isVerified ? (
                                  <FiCheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <FiClock className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-xs font-medium text-gray-500">
                                  Status
                                </p>
                                <p
                                  className={`text-sm mt-1 ${
                                    agency.isVerified
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                  }`}
                                >
                                  {agency.isVerified ? "Verified" : "Pending"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-6">
                    <motion.button
                      onClick={() => handleSelect(agency)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Request Verification{" "}
                      <FiChevronRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="mx-auto h-24 w-24 text-gray-400">
              <FiShield className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No agencies available
            </h3>
            <p className="mt-1 text-gray-500">
              Please check back later or contact support
            </p>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && selectedAgency && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Confirm Request
                    </h2>
                    <p className="text-gray-600">
                      You're about to request verification from{" "}
                      {selectedAgency.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">
                        Verification Process
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This agency will review your documents and confirm your
                        migrant status. Average processing time:{" "}
                        {selectedAgency.avgVerificationTime || "3-5 days"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSelection}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Confirm Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectAgency;
