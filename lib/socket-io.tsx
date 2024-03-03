import { Socket, io as socketIO } from "socket.io-client";

const socketURL = `${
  process.env.NEXT_PUBLIC_SOCKET_URL?.includes("https://")
    ? process.env.NEXT_PUBLIC_SOCKET_URL
    : `${process.env.NEXT_PUBLIC_SOCKET_URL}:3002`
}`;

export default function getIO() {
  const io = socketIO(socketURL, {
    path: "/socket",
    addTrailingSlash: false,
    reconnectionDelay: 1000,
    reconnectionAttempts: 3,
    transports: ["websocket"],
  });

  io.on("connect", () => {
    console.log("[socket]: en línea");
  });

  io.on("disconnect", () => {
    console.log("[socket]: desconectado");
  });

  io.on("connect_error", async (error) => {
    console.log("[socket]: error de conexión", error);
  });

  return io;
}
