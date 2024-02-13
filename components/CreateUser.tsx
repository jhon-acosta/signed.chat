import axios from "axios";
import { useState } from "react";
import { User } from "@/api/models/User";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, Select, message } from "antd";

const avatars = [
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
  "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
];

const CreateUser = () => {
  const [form] = Form.useForm<User>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: User) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/users", values);
      localStorage.setItem("currentUser", JSON.stringify(response.data.data));
      message.success(
        `Usuario ${response.data.data.username} creado correctamente`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <Card title="Genera un usuario" className="w-96">
        <Form
          form={form}
          initialValues={{
            username: "",
            avatar: avatars[0],
          }}
          layout="horizontal"
          wrapperCol={{ sm: 16 }}
          labelCol={{ span: 6 }}
          autoComplete="off"
          onFinish={onSubmit}
          disabled={isLoading}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Ingresa un usuario" }]}
            normalize={(value: string) => value.toLocaleLowerCase()?.trim()}
          >
            <Input placeholder="Ingresa un usuario" />
          </Form.Item>
          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: "Selecciona un avatar" }]}
          >
            <Select
              className="w-10"
              options={avatars.map((avatar, index) => ({
                label: (
                  <>
                    {index + 1}: <Avatar src={avatar} />
                  </>
                ),
                value: avatar,
              }))}
            />
          </Form.Item>
          <div className="flex justify-center items-center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={isLoading}
            >
              Comenzar chat
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;
