import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_CONTROL_PLANE_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
