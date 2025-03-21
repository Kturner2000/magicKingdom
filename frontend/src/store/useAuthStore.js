import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    //checkAuth()
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            // similar when you use setState in useState
            set({ authUser: res.data });
        } catch (err) {
            console.log("Error in checkAuth:", err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            // send data from signup form to "/auth/signup"
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (err) {
            toast.error(err.res.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (err) {
            toast.error(err.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (err) {
            toast.error(err.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = axiosInstance.put("/auth/update-profile", data);
            if (res.data.token) {
                // Assuming you have a method to set the auth token
                setAuthToken(res.data.token);
            }
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (err) {
            console.log("error in update profile:", err);
            toast.error(err.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket: socket });

        //listen for online user updates
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
