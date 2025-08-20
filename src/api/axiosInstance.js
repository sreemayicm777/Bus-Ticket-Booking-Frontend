import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bus-ticket-booking-backend-o4j4.onrender.com/api", // ✅ Live backend URL
  // baseURL: "http://localhost:5000/api", // ❌ Local development URL
});

// 🔐 Attach token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
