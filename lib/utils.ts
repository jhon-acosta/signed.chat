import axios from "axios";

export const axiosApp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});
