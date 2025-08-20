import axios from "axios";

// const apiUrl = process.env.REACT_APP_API_BASE_URL;
// console.log(apiUrl);

const axiosInstance = axios.create({
  baseURL: "https://bus-ticket-booking-backend-o4j4.onrender.com/api",
});

console.log("Axios instance created with base URL:", axiosInstance.defaults.baseURL);
// 🔐 Attach token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;