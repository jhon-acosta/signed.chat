

import { useState, useEffect } from "react";
import { axiosApp } from "@/lib/utils";
import { SendOutlined } from "@ant-design/icons";
import { UsuarioChat } from "@/types/UsuariosChat";
import { Avatar, Button, Card, Form, Input, Select, message } from "antd";
import getIO from "@/lib/socket-io";

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
  const [form] = Form.useForm<UsuarioChat>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false); // Estado para controlar la conexión del socket
  const loadingImage = "loading.gif";

  useEffect(() => {
    const socket = getIO(); // Obtener el socket
    socket.on("connect", () => {
      console.log("Connected to socket");
      setIsSocketConnected(true); // Cambiar el estado cuando se conecte el socket
      setIsLoading(false); // Cambiar el estado de carga a falso
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsSocketConnected(false); // Cambiar el estado cuando se desconecte el socket
    });

    return () => {
      socket.disconnect(); // Desconectar el socket al desmontar el componente
    };
  }, []);

  const onSubmit = async (values: UsuarioChat) => {
    setIsLoading(true);
    try {
      const response = await axiosApp.post<UsuarioChat>(
        "/v1/publico/usuarios",
        values
      );
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      message.success(`Usuario creado correctamente`);
      await axiosApp.post(`/v1/publico/usuarios/${response.data._id}/estado`, {
        estado: "online",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      {isLoading ? ( // Mostrar GIF de carga mientras se conecta al socket
        <div>
         <img src={loadingImage} alt="Cargando..." />
      </div>
      ) : (
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
            disabled={!isSocketConnected} // Deshabilitar el formulario si el socket no está conectado
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
      )}
    </div>
  );
};

export default CreateUser;
