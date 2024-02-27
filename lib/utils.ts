import axios from "axios";

export const axiosApp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export const getUsuarioLocalStg = () => {
  const usuario = localStorage.getItem("currentUser");
  return usuario ? JSON.parse(usuario) : null;
};
