import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function BookBusPage() {
  const { id } = useParams(); // busId
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [form, setForm] = useState({ from: "", to: "", seatsBooked: 1 });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/buses/${id}`);
        setBus(res.data);
        
        // Set default from and to values
        if (res.data.stops && res.data.stops.length > 0) {
          setForm(prev => ({
            ...prev,
            from: res.data.stops[0].name,
            to: res.data.stops[res.data.stops.length - 1].name
          }));
        }
      } catch (err) {
        setError("Failed to load bus details");
        console.error("Error fetching bus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  // Calculate fare based on selected stops
  const calculateFare = () => {
    if (!bus || !bus.stops || !form.from || !form.to) return 0;
    
    const fromStop = bus.stops.find(stop => stop.name === form.from);
    const toStop = bus.stops.find(stop => stop.name === form.to);
    
    if (!fromStop || !toStop) return 0;
    
    // Calculate absolute difference in fare
    return Math.abs(toStop.fareFromStart - fromStop.fareFromStart) * form.seatsBooked;
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Initialize Razorpay payment
  const initiatePayment = async () => {
    try {
      setPaymentLoading(true);
      const totalFare = calculateFare();
      
      // Create order on backend
      const orderResponse = await axiosInstance.post('/payments/create-order', {
        amount: totalFare,
        currency: 'INR'
      });
      
      const { order } = orderResponse.data;
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
      
      if (!scriptLoaded) {
        setError('Razorpay SDK failed to load. Are you online?');
        setPaymentLoading(false);
        return;
      }
      
      // Get user data (you might want to fetch this from your auth context)
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_skeTV1oLzL8btw',
        amount: order.amount,
        currency: order.currency,
        name: 'Bus Booking System',
        description: `Booking for ${bus.busName} from ${form.from} to ${form.to}`,
        image: '/logo.png', // Add your logo URL
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on backend
          try {
            await axiosInstance.post('/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            // Payment verified, create booking
            await completeBooking(response.razorpay_payment_id);
          } catch (err) {
            console.error('Payment verification failed:', err);
            setError('Payment verification failed. Please contact support.');
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: userData.name || 'Customer',
          email: userData.email || 'customer@example.com',
          contact: userData.phone || '9999999999'
        },
        theme: {
          color: '#4f46e5' // Indigo color to match your theme
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
          }
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.response?.data?.message || 'Payment initiation failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Complete booking after successful payment
  const completeBooking = async (paymentId) => {
    try {
      await axiosInstance.post("/payments/", { 
        busId: id, 
        ...form, 
        paymentId 
      });
      
      navigate("/my-bookings", { 
        state: { 
          message: "Booking successful!",
          bookingDetails: {
            busName: bus.busName,
            from: form.from,
            to: form.to,
            seats: form.seatsBooked,
            totalFare: calculateFare()
          }
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!bus.isActive) {
      setError("This bus is not available for booking.");
      return;
    }
    
    if (form.seatsBooked > bus.seatsAvailable) {
      setError("Not enough seats available.");
      return;
    }
    
    await initiatePayment();
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

  if (!bus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bus Not Found</h2>
          <p className="text-gray-600 mb-6">The bus you're looking for doesn't exist or is no longer available.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Available Buses
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
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6">
            <button
              onClick={() => navigate(-1)}
              className="text-indigo-100 hover:text-white transition-colors mb-4 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl font-bold">Book Your Journey</h2>
            <p className="text-indigo-100 mt-1">Reserve your seats on {bus.busName}</p>
          </div>

          <div className="p-6">
            {/* Bus Summary */}
            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-indigo-900">{bus.busName}</h3>
                <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {bus.busNumber}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-indigo-700">
                <div>
                  <div className="font-medium">Departure</div>
                  <div>{new Date(bus.startDateTime).toLocaleDateString()}</div>
                  <div>{new Date(bus.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-1 w-16 bg-indigo-300 rounded-full my-1"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="h-1 w-16 bg-indigo-300 rounded-full my-1"></div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">Arrival</div>
                  <div>{new Date(bus.endDateTime).toLocaleDateString()}</div>
                  <div>{new Date(bus.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-indigo-100">
                <div className="text-sm">
                  <span className="text-indigo-600">Seats Available: </span>
                  <span className="font-semibold">{bus.seatsAvailable}</span>
                </div>
                <div className="text-sm">
                  <span className="text-indigo-600">Status: </span>
                  <span className={`font-semibold ${bus.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {bus.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
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
              {/* From and To Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <select
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    {bus.stops.map((s, index) => (
                      <option key={s.name} value={s.name}>
                        {index + 1}. {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <select
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    {bus.stops.map((s, index) => (
                      <option key={s.name} value={s.name}>
                        {index + 1}. {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seats Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (form.seatsBooked > 1) {
                        setForm({ ...form, seatsBooked: form.seatsBooked - 1 });
                      }
                    }}
                    className="bg-gray-200 text-gray-700 h-10 w-10 rounded-l-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                    disabled={form.seatsBooked <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <input
                    type="number"
                    value={form.seatsBooked}
                    min={1}
                    max={bus.seatsAvailable}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(bus.seatsAvailable, Number(e.target.value)));
                      setForm({ ...form, seatsBooked: value });
                    }}
                    className="h-10 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (form.seatsBooked < bus.seatsAvailable) {
                        setForm({ ...form, seatsBooked: form.seatsBooked + 1 });
                      }
                    }}
                    className="bg-gray-200 text-gray-700 h-10 w-10 rounded-r-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                    disabled={form.seatsBooked >= bus.seatsAvailable}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  
                  <span className="ml-3 text-sm text-gray-500">
                    Max: {bus.seatsAvailable} seats
                  </span>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Fare Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Fare</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{calculateFare()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Includes all applicable taxes and charges
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={paymentLoading || !bus.isActive}
                className={`w-full py-3.5 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                  paymentLoading || !bus.isActive
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {paymentLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : !bus.isActive ? (
                  "Bus Not Available"
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Proceed to Payment
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookBusPage;