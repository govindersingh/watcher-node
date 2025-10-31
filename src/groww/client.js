import axios from "axios";
import { config } from "../config/env.js";
import { getGrowwAccessToken } from "./auth.js";

export const growwClient = axios.create({
  baseURL: config.GROWW_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach access token
growwClient.interceptors.request.use(async (req) => {
  const token = await getGrowwAccessToken();
  req.headers.Authorization = `Bearer ${token}`;
  return req;
});
