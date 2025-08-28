import axios from "axios";
// const BASE_URL = "http://localhost:3000/api";  
const BASE_URL = "http://192.168.158.190:3000/api";
//const BASE_URL = "http://13.48.10.128/api";
// const BASE_URL = "/api";
// const BASE_URL = "http://10.10.23.48:3000/api";
//const BASE_URL = 'https://backend-2-o7e5.onrender.com/api';

// For protected routes
const ProtectedAPI = axios.create({
  baseURL: BASE_URL,
});

ProtectedAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// For public routes (no auth token needed)
const PublicAPI = axios.create({
  baseURL: BASE_URL,
});

export { ProtectedAPI, PublicAPI };



















