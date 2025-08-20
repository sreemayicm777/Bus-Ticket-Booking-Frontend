import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

function ViewBus() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBus = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/buses/${id}`);
        setBus(response.data);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch bus:", err);
        setError("Failed to load bus details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (error || !bus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Bus Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The bus you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Fare Calculation
  const farePerSegment = 100;
  const totalSegments = bus.stops?.length - 1;
  const totalFare = farePerSegment * totalSegments;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="bg-indigo-100 text-indigo-800 p-2 rounded-lg mr-3">🚌</span>
            {bus.name} - {bus.busNumber}
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <span className="mr-2">←</span> Back
          </motion.button>
        </div>

        {/* Main Bus Info Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bus Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <span className="text-indigo-600 text-xl">📍</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium text-gray-900">{bus.from}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <span className="text-indigo-600 text-xl">🏁</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium text-gray-900">{bus.to}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <span className="text-indigo-600 text-xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{new Date(bus.startDateTime).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <span className="text-indigo-600 text-xl">⏰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(bus.startDateTime).toLocaleTimeString()} - {new Date(bus.endDateTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <span className="text-green-600">💺</span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">{bus.seatsAvailable}</span> seats available
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fare Details Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">💰</span>
              Fare Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Fare per segment:</span>
                <span className="font-medium">₹{farePerSegment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total segments:</span>
                <span className="font-medium">{totalSegments}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Total fare:</span>
                  <span className="text-indigo-600 font-bold">₹{totalFare}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Amenities Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">🛏️</span>
              Amenities
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Comfortable seating</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Charging points</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Reading lights</span>
              </li>
              <li className="flex items-center">
                <span className={bus.hasAC ? "text-green-500 mr-2" : "text-gray-400 mr-2"}>
                  {bus.hasAC ? "✓" : "✗"}
                </span>
                <span className={bus.hasAC ? "" : "text-gray-500"}>Air conditioning</span>
              </li>
              <li className="flex items-center">
                <span className={bus.hasWifi ? "text-green-500 mr-2" : "text-gray-400 mr-2"}>
                  {bus.hasWifi ? "✓" : "✗"}
                </span>
                <span className={bus.hasWifi ? "" : "text-gray-500"}>Wi-Fi</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Route Info Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">🛣️</span>
            Route Information
          </h2>
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-indigo-200"></div>
            
            <ul className="space-y-6 pl-10">
              {bus.stops?.map((stop, i) => (
                <li key={stop._id} className="relative">
                  <div className={`absolute -left-10 top-2.5 w-8 h-8 rounded-full flex items-center justify-center 
                    ${i === 0 ? "bg-indigo-600 text-white" : 
                    i === bus.stops.length - 1 ? "bg-green-600 text-white" : "bg-white border-2 border-indigo-400"}`}>
                    {i === 0 ? "🚌" : i === bus.stops.length - 1 ? "🏁" : i}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-medium text-gray-900">{stop.name}</h3>
                    <p className="text-sm text-gray-500">Fare from start: ₹{stop.fareFromStart ?? 0}</p>
                    {stop.arrivalTime && (
                      <p className="text-sm text-gray-500 mt-1">
                        Arrival: {new Date(stop.arrivalTime).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Precautions Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">⚠️</span>
            Safety Precautions
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Please arrive 15 minutes before departure</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Carry a valid ID proof</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>No smoking inside the bus</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Follow COVID-19 protocols (if applicable)</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Keep your belongings safe at all times</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex-1 flex items-center justify-center"
          >
            <span className="mr-2">←</span> Back to List
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ViewBus;