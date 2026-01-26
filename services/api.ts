import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  params: {
    language: "en-US",
  },
});

// Add a response interceptor to handle errors or formatting if needed
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);
