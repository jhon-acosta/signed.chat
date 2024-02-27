import { useState, useEffect } from "react";
import { axiosApp } from "@/lib/utils";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import { UsuarioChat } from "@/types/UsuariosChat";
import { Avatar, Button, Card, Form, Input, Select, Upload, message } from "antd";
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
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [isPrivateKey, setIsPrivateKey] = useState(false);
  const loadingImage = "loading.gif";

  useEffect(() => {
    const socket = getIO();
    socket.on("connect", () => {
      console.log("Connected to socket");
      setIsSocketConnected(true);
      setIsLoading(false);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsSocketConnected(false);
    });

    return () => {
      socket.disconnect();
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
      message.success("Usuario nuevo creado. Bienvenido al chat.");

      await axiosApp.post(`/v1/publico/usuarios/${response.data._id}/estado`, {
        estado: "online",
      });

      setExistingUser(true);
      setIsPrivateKey(true);
    } catch (error) {
      console.error(error);
      const existingUserResponse = await axiosApp.get<UsuarioChat[]>(
        `/v1/publico/usuarios?username=${values.username}`
      );

      if (existingUserResponse.data.length > 0) {
        setExistingUser(true);
        setIsPrivateKey(true);

        // Mostrar mensaje solo si es un usuario existente
        message.warning("Usuario ya existe. Carga la clave privada para reanudar.");
      } else {
        message.error("Error al crear el usuario.");
      }
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <div className="flex justify-center items-center w-full">
      {isLoading ? (
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

            {existingUser ? (
              isPrivateKey ? (
                <Form.Item
                label="Carga Clave Privada"
                name="privateKey"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => e.fileList}
                rules={[
                  {
                    required: true,
                    message: "Carga tu archivo de clave privada (.pem)",
                  },
                ]}
              >
                <Upload beforeUpload={() => false} accept=".pem">
                  <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                </Upload>
              </Form.Item>
              ) : (
                <Form.Item
                  label="Avatar"
                  name="avatar"
                  rules={[{ required: true, message: "Selecciona un avatar" }]}
                >
                  <Input type="file" accept=".png, .jpg, .jpeg" />
                </Form.Item>
              )
            ) : (
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
            )}

            {/* Mostrar el botón de enviar solo si el usuario no existe o si existe y se cargó la clave privada */}
            {(existingUser && isPrivateKey) || !existingUser ? (
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
            ) : null}
          </Form>
        </Card>
      )}
    </div>
  );
};

export default CreateUser;