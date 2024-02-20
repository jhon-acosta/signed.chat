"use client";
import axios from "axios";
import { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  const agregarUsuario = async () => {
    try {
      const response = await axios.post("/api/usuarios-chat", {
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
