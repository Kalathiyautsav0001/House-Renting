import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const API = axios.create({ baseURL: `${API_BASE_URL}/api` });

// Helper to format image URLs (Cloudinary vs local uploads)
export const getImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }
  return `${API_BASE_URL}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
};

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
