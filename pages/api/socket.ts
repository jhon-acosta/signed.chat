import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import { NextApiResponseWithSocket } from "@/types/api.socket";

const socketServer = (PORT = 3001) => {
  const io = new Server({
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*" },
  }).listen(PORT);

  io.on("connect", (socket) => {
    const _socket = socket;
    console.log("socket connect", socket.id);
    _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`);
    socket.on("disconnect", async () => {
      console.log("socket disconnect");
    });
  });

  console.log("socket.io server on port:", PORT);

  return io;
};

export default function SocketHandler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    res.status(200).json({
      success: true,
      message: "Socket is already running",
      socket: `:3001`,
    });
    return;
  }

  res.socket.server.io = socketServer();

  res.status(201).json({
    success: true,
    message: "Socket is started",
    socket: `:3001`,
  });
}
