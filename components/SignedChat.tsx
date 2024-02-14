"use client";
import axios from "axios";
import { useState } from "react";
import { Button, Input } from "antd";
import { io } from "socket.io-client";
import { SendOutlined } from "@ant-design/icons";

export const socketClient = () => {
  const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}:3001`, {
    path: "/api/socket",
    addTrailingSlash: false,
    reconnectionDelay: 1000,
    reconnectionAttempts: 3,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("connect_error", async (err) => {
    console.log(`connect_error due to ${err.message}`);
    await fetch("/api/socket");
  });

  return socket;
};

const ChatPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const agregarUsuario = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/users", {
        username: inputValue,
      });
      setInputValue(""); // Limpiar el campo de entrada después de agregar el usuario
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex gap-x-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button
        icon={<SendOutlined />}
        type="link"
        onClick={() => agregarUsuario()}
      ></Button>
    </div>
  );
};

export default ChatPage;
