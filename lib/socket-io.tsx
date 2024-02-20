import { io as socketIO } from "socket.io-client";

const socketURL = `${process.env.NEXT_PUBLIC_SOCKET_URL}:3002`;

export default function getIO() {
  const io = socketIO(socketURL, {
    path: "/socket",
    addTrailingSlash: false,
    reconnectionDelay: 1000,
    reconnectionAttempts: 3,
    transports: ["websocket"],
  });

  io.on("connect", () => {
    console.log("Connected");
  });

  io.on("disconnect", () => {
    console.log("Disconnected");
  });

  io.on("connect_error", async (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  return io;
}
