"use client";
import { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

const ChatPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex gap-x-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button icon={<SendOutlined />} type="link"></Button>
    </div>
  );
};

export default ChatPage;
