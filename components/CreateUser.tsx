import { useEffect, useState } from "react";
import { axiosApp } from "@/lib/utils";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import { UsuarioChat } from "@/types/UsuariosChat";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Select,
  Spin,
  Upload,
  UploadFile,
  message,
} from "antd";
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

interface UsuarioCustom extends Omit<UsuarioChat, "privateKey"> {
  privateKey: {
    originFileObj: File;
  }[];
}

const CreateUser = () => {
  const [form] = Form.useForm<UsuarioCustom>();
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isSocketConnecting, setIsSocketConnecting] = useState(true); // Nuevo estado para la conexión del socket

  useEffect(() => {
    const socket = getIO(); // Obtener el socket
    socket.on("connect", () => {
      console.log("Connected to socket");
      setIsSocketConnecting(false); // Cambiar el estado cuando se conecte el socket
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsSocketConnecting(true); // Cambiar el estado cuando se desconecte el socket
    });

    return () => {
      socket.disconnect(); // Desconectar el socket al desmontar el componente
    };
  }, []);

  const onSubmit = async (values: UsuarioCustom) => {
    setIsLoading(true);
    try {
      const response = await axiosApp.post<UsuarioChat>(
        "/v1/publico/usuarios",
        values
      );

      localStorage.setItem("currentUser", JSON.stringify(response.data));
      message.success(`Usuario creado correctamente`);
    } catch (error) {
      console.error(error);
      const existingUserResponse = await axiosApp.get<UsuarioChat[]>(
        `/v1/publico/usuarios?username=${values.username}`
      );

      if (existingUserResponse.data.length > 0) {
        setUserExists(true);

        // Mostrar mensaje solo si es un usuario existente
        message.warning(
          "Usuario ya existe. Carga la clave privada para reanudar."
        );
      } else {
        message.error("Error al crear el usuario.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2 = async (values: UsuarioCustom) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", values.privateKey[0].originFileObj);

      const response = await axiosApp.post(
        `/v1/publico/usuarios/${values.username}/reanudar-chat`,
        formData
      );

      localStorage.setItem("currentUser", JSON.stringify(response.data));

      // Realizar un refresh de la página después de completar la operación
      // window.location.reload();
    } catch (error) {
      // Manejar errores, por ejemplo, problemas de red
      console.error("Error al procesar la solicitud:", error);

      // Mostrar un mensaje de error si la carga de la clave privada falla
      message.error("Se produjo un error al cargar la clave privada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      {isSocketConnecting ? ( // Mostrar mensaje de carga mientras se conecta al socket
        <Flex
          gap="small"
          vertical
          style={{
            backgroundColor: "white",
            padding: "70px",
            borderRadius: "40px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Flex gap="small" align="center">
            <Spin size="large">
              <div className="content" />
            </Spin>
          </Flex>
          <div className="content" style={{ marginTop: "20px" }}>
            Loading...
          </div>
        </Flex>
      ) : userExists ? (
        // Mostrar el Card de Usuario Ya Existe
        <Card title="Usuario ya Existe" className="w-96">
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
            onFinish={onSubmit2}
            disabled={isLoading}
          >
            <Form.Item
              label="Usuario"
              name="username"
              rules={[{ required: false, message: "Ingresa un usuario" }]}
              normalize={(value: string) => value.toLocaleLowerCase()?.trim()}
            >
              <Input placeholder="Ingresa un usuario" />
            </Form.Item>
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
      ) : (
        // Mostrar el Card de Generar Usuario
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
      )}
    </div>
  );
};
export default CreateUser;