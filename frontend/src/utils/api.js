import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Handle global 401 response
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      
      // Force redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
