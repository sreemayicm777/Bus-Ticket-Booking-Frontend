import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    setCancellingId(id);
    try {
      await axiosInstance.put(`/bookings/cancel/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, Status: "cancelled" } : b))
      );
    } catch (err) {
      alert("Cancel failed. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "cancelled":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "pending":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold">My Bookings</h2>
            <p className="text-indigo-100 mt-1">Manage your bus reservations</p>
          </div>

          <div className="p-6">
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

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
                <p className="mt-1 text-gray-500">You haven't made any bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{booking.bus.name}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.Status)}`}>
                              {getStatusIcon(booking.Status)}
                              <span className="ml-1 capitalize">{booking.Status}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 mb-1">Route</div>
                              <div className="font-medium flex items-center">
                                <span className="text-indigo-700">{booking.from}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                <span className="text-indigo-700">{booking.to}</span>
                              </div>
                            </div>

                            <div>
                              <div className="text-gray-600 mb-1">Bus Number</div>
                              <div className="font-medium text-gray-900">{booking.bus.busNumber}</div>
                            </div>

                            <div>
                              <div className="text-gray-600 mb-1">Seats Booked</div>
                              <div className="font-medium text-gray-900">{booking.seatsBooked}</div>
                            </div>

                            <div>
                              <div className="text-gray-600 mb-1">Total Fare</div>
                              <div className="font-medium text-indigo-600 text-lg">₹{booking.totalFare}</div>
                            </div>

                            {booking.createdAt && (
                              <div className="md:col-span-2">
                                <div className="text-gray-600 mb-1">Booked On</div>
                                <div className="font-medium text-gray-900">
                                  {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {booking.Status === "Confirmed" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => cancelBooking(booking._id)}
                              disabled={cancellingId === booking._id}
                              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                cancellingId === booking._id
                                  ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {cancellingId === booking._id ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel Booking
                                </>
                              )}
                            </motion.button>
                          )}
                          
                          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MyBookingsPage;