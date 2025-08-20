import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function CreateBus() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    stopNames: [""],
    startDateTime: "",
    endDateTime: "",
    seatsAvailable: 40,
    isActive: true,
    name: "",
    busNumber: "",
    busName: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 👉 Add a new stop field
  const addStop = () => {
    setForm({ ...form, stopNames: [...form.stopNames, ""] });
  };

  // 👉 Remove a stop field
  const removeStop = (index) => {
    if (form.stopNames.length <= 1) return;
    const updatedStops = [...form.stopNames];
    updatedStops.splice(index, 1);
    setForm({ ...form, stopNames: updatedStops });
  };

  // 👉 Handle stop name change
  const handleStopChange = (index, value) => {
    const updatedStops = [...form.stopNames];
    updatedStops[index] = value;
    setForm({ ...form, stopNames: updatedStops });
  };

  // 👉 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axiosInstance.post("/buses", form);
      navigate("/"); // Redirect to home or bus list
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">This area is restricted to administrators only.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </button>
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
              <h2 className="text-2xl font-bold text-gray-900">Create New Bus</h2>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">Add a new bus to the system with all necessary details.</p>
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
                  value={form.busName}
                  onChange={(e) => setForm({ ...form, busName: e.target.value })}
                  placeholder="e.g., Express Deluxe"
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
                  value={form.busNumber}
                  onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
                  placeholder="e.g., KA01AB1234"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Stops Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Route Stops
              </label>
              <div className="space-y-3">
                {form.stopNames.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      placeholder={`Stop ${index + 1} name`}
                      value={stop}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                    />
                    {form.stopNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStop}
                className="mt-3 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Another Stop
              </button>
            </div>

            {/* Date & Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.startDateTime}
                  onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.endDateTime}
                  onChange={(e) => setForm({ ...form, endDateTime: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Seats & Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats Available
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.seatsAvailable}
                  onChange={(e) => setForm({ ...form, seatsAvailable: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-start pt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
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
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                  loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Bus...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Bus
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

export default CreateBus;