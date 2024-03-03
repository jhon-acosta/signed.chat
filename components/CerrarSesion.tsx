import { FC } from "react";
import { Button } from "antd";
import { axiosApp } from "@/lib/utils";
import { LogoutOutlined } from "@ant-design/icons";

const CerrarSesion: FC<{ id: string }> = (props) => {
  const cerrarSesion = async () => {
    try {
      await axiosApp.post(`/v1/publico/usuarios/${props.id}/estado`, {
        estado: "offline",
      });
      localStorage.removeItem("currentUser");
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Button type="link" icon={<LogoutOutlined />} onClick={cerrarSesion}>
      Cerrar sesión
    </Button>
  );
};

export default CerrarSesion;
