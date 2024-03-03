import { useState } from "react";
import { axiosApp } from "@/lib/utils";
import { UsuarioChat } from "@/types/UsuariosChat";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Avatar,
  Select,
  Button,
  Upload,
  message,
} from "antd";

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
  privateKey: { file: File };
}

const CreateUser = () => {
  const [form] = Form.useForm<UsuarioCustom>();
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioExistente, setUsuarioExistente] = useState(false);

  const onSubmit = async (values: UsuarioCustom) => {
    try {
      setIsLoading(true);
      let data;
      if (usuarioExistente) {
        const formData = new FormData();
        formData.append("file", values.privateKey.file);
        const response = await axiosApp.post(
          `/v1/publico/usuarios/${values.username}/reanudar-chat`,
          formData
        );
        data = response.data;
        message.success(`Sesion reanudada correctamente.`);
      } else {
        const response = await axiosApp.post<UsuarioChat>(
          "/v1/publico/usuarios",
          values
        );
        data = response.data;
        message.success(`Usuario creado correctamente`);
      }
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (error) {
      console.error(error);
      setUsuarioExistente(true);
      message.warning((error as any)?.response?.data);
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
          wrapperCol={{ sm: 14 }}
          labelCol={{ span: 8 }}
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
          {usuarioExistente ? (
            <Form.Item
              label="Clave privada"
              name="privateKey"
              valuePropName="file"
              rules={[
                {
                  required: true,
                  message: "Carga tu clave privada (.pem)",
                },
              ]}
            >
              <Upload
                accept=".pem"
                beforeUpload={(file) => {
                  form.setFieldValue("privateKey", { file });
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
              </Upload>
            </Form.Item>
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
          <div className="flex justify-center items-center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={isLoading}
            >
              {usuarioExistente ? "Reanudar chat" : "Crear usuario"}
            </Button>
          </div>
        </Form>
      </Card>
      {/* )} */}
    </div>
  );
};
export default CreateUser;
