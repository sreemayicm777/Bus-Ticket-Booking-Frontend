import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

function UpdateBus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState({
    stopNames: [],
    startDateTime: "",
    endDateTime: "",
    seatsAvailable: 1,
    isActive: true,
    name: "",
    busNumber: "",
    busName: ""
  });
  const [newStop, setNewStop] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBus = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/buses/${id}`);
        const data = res.data;
        setBus({
          stopNames: data.stops.map((s) => s.name),
          startDateTime: data.startDateTime,
          endDateTime: data.endDateTime,
          seatsAvailable: data.seatsAvailable,
          isActive: data.isActive,
          name: data.name || "",
          busNumber: data.busNumber || "",
          busName: data.busName || ""
        });
      } catch (err) {
        setError("Failed to fetch bus details");
        console.error("Failed to fetch bus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  const handleAddStop = () => {
    if (newStop.trim()) {
      setBus({ ...bus, stopNames: [...bus.stopNames, newStop.trim()] });
      setNewStop("");
    }
  };

  const handleRemoveStop = (index) => {
    if (bus.stopNames.length <= 1) {
      setError("Bus must have at least one stop");
      return;
    }
    const updated = [...bus.stopNames];
    updated.splice(index, 1);
    setBus({ ...bus, stopNames: updated });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    
    try {
      const updatedBus = {
        ...bus,
        stops: bus.stopNames.map((name) => ({ name })),
      };
      delete updatedBus.stopNames;

      await axiosInstance.put(`/buses/${id}`, updatedBus);
      navigate("/", { 
        state: { 
          message: "Bus updated successfully!",
          busName: bus.name
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bus details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Update Bus</h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                bus.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {bus.isActive ? (
                  <>
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Active
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Inactive
                  </>
                )}
              </span>
              <span className="text-sm text-gray-500">Bus ID: {id}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bus Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bus Name
                </label>
                <input
                  type="text"
                  value={bus?.busName}
                  onChange={(e) => setBus({ ...bus, busName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bus Number
                </label>
                <input
                  type="text"
                  value={bus.busNumber}
                  onChange={(e) => setBus({ ...bus, busNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Stops Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Route Stops
              </label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter stop name"
                  disabled={!bus.isActive}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleAddStop}
                  disabled={!bus.isActive || !newStop.trim()}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    !bus.isActive || !newStop.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  Add Stop
                </motion.button>
              </div>

              <div className="space-y-2">
                {bus.stopNames.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium">
                      {idx + 1}
                    </div>
                    <span className="flex-1 text-gray-900">{stop}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      disabled={!bus.isActive || bus.stopNames.length <= 1}
                      className={`p-1 rounded transition-colors ${
                        !bus.isActive || bus.stopNames.length <= 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-500 hover:text-red-700"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bus.startDateTime.slice(0, 16)}
                  onChange={(e) => setBus({ ...bus, startDateTime: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={!bus.isActive}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bus.endDateTime.slice(0, 16)}
                  onChange={(e) => setBus({ ...bus, endDateTime: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={!bus.isActive}
                  required
                />
              </div>
            </div>

            {/* Seats & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats Available
                </label>
                <input
                  type="number"
                  min="1"
                  value={bus.seatsAvailable}
                  onChange={(e) => setBus({ ...bus, seatsAvailable: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={!bus.isActive}
                  required
                />
              </div>

              <div className="flex items-center justify-start pt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bus.isActive}
                    onChange={(e) => setBus({ ...bus, isActive: e.target.checked })}
                    id="isActive"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Bus is Active
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updating}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                  updating ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {updating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Bus...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Bus
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default UpdateBus;