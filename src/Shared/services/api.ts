import axios, { type InternalAxiosRequestConfig } from "axios";
import { supabase } from "@/Shared/lib/supabase";

const authInterceptor = async (config: InternalAxiosRequestConfig) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
};

export const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(authInterceptor, (error) => {
  return Promise.reject(error);
});

export const apiForm = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
});

apiForm.interceptors.request.use(authInterceptor, (error) => {
  return Promise.reject(error);
});
