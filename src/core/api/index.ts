import axios from "axios";
import { API } from "./types";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  withCredentials: true,
});

// Utility to normalize errors
function normalizeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const backendError = (error.response?.data as any)?.error;
    return backendError || error.message || "Unknown error";
  }

  return "Unknown error";
}

export const api: API = {
  async get({ entity, options }) {
    try {
      const response = await axiosClient.get(entity, options);
      return response.data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async post({ entity, data, options = {} }) {
    try {
      const response = await axiosClient.post(entity, data, options);
      return response.data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async patch({ entity, data, options = {} }) {
    try {
      const response = await axiosClient.patch(entity, data, options);
      return response.data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async delete({ entity, options = {} }) {
    try {
      const response = await axiosClient.delete(entity, options);
      return response.data;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
