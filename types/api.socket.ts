import type { Socket as NetSocket } from "net";
import type { Server as HTTPServer } from "http";
import type { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiRequestWithSocket extends NextApiRequest {
  socket: SocketWithIO;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
