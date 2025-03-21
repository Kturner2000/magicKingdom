import axios from "axios";

const API_URL = process.env.VITE_API_URL || "http://localhost:5001/api";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});