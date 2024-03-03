import { UsuarioChat } from "@/types/UsuariosChat";
import axios from "axios";
import crypto from "crypto";

export const axiosApp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export const getUsuarioLocalStg = (): UsuarioChat | null => {
  const usuario = localStorage.getItem("currentUser");
  return usuario ? JSON.parse(usuario) : null;
};

export const encriptarMensaje = (args: { key: string; mensaje: string }) => {
  const mensajeBuffer = Buffer.from(args.mensaje, "utf-8");
  const mensajeEncriptado = crypto[
    args.key.includes("PRIVATE") ? "privateEncrypt" : "publicEncrypt"
  ]?.(args.key, mensajeBuffer);
  return mensajeEncriptado.toString("base64");
};

export const desencriptarMensaje = (args: {
  key: string;
  messageBase64: string;
}) => {
  const mensajeDesencriptado = crypto[
    args.key.includes("PRIVATE") ? "privateDecrypt" : "publicDecrypt"
  ]?.(args.key, Buffer.from(args.messageBase64, "base64"));
  return mensajeDesencriptado.toString();
};
