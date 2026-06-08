// api.js  ← yeh file banao
import axios from "axios";
import { store } from "../redux/store";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL_API}api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// ✅ 401 aaye toh automatic logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearToken()); // token clear karo
      window.location.href = "/login"; // login pe bhejo
    }
    return Promise.reject(error);
  }
);

export default api;