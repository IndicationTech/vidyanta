import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:5000/api",
});

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const signup = (name, email, password, role) =>
  API.post("/auth/signup", { name, email, password, role });

export default API;
