import { FC } from "react";
import { Button } from "antd";
import { axiosApp } from "@/lib/utils";
import { KeyOutlined } from "@ant-design/icons";

const DescargarClaves: FC<{ id: string; tipo: "publica" | "privada" }> = (
  props
) => {
  const descargar = async () => {
    try {
      const response = await axiosApp.get(
        `/v1/publico/usuarios/${props.id}/descargar/clave-${props.tipo}`,
        { responseType: "text" }
      );
      const blob = new Blob([response.data], {
        type: "application/x-pem-file",
      });
      const enlace = document.createElement("a");
      enlace.href = window.URL.createObjectURL(blob);
      enlace.download = `clave-${props.tipo}.pem`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Button type="link" icon={<KeyOutlined />} onClick={descargar}>
      Descargar clave {props.tipo}{" "}
    </Button>
  );
};

export default DescargarClaves;
