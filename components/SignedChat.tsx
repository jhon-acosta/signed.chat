"use client";
import crypto from "crypto";
import { axiosApp } from "@/lib/utils";
import { Socket } from "socket.io-client";
import { FC, useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { UsuarioChat } from "@/types/UsuariosChat";
import { Avatar, Button, Input, Typography, message } from "antd";

const Mensaje: FC<{ texto: string; alineacion: string }> = ({
  texto,
  alineacion,
}) => {
  const alineacionClase = alineacion === "derecha" ? "text-right" : "text-left";

  return (
    <div className={`my-2 ${alineacionClase}`}>
      <p className="bg-blue-500 text-white p-4 rounded-md shadow-md inline-block">
        {texto}
      </p>
    </div>
  );
};

const encriptarMensaje = (args: { publicKey: string; mensaje: string }) => {
  const mensajeBuffer = Buffer.from(args.mensaje, "utf-8");
  const mensajeEncriptado = crypto.publicEncrypt(args.publicKey, mensajeBuffer);
  return mensajeEncriptado.toString("base64");
};

const ChatPage: FC<{
  io?: Socket;
  currentUser?: UsuarioChat;
  receiverUser?: UsuarioChat;
}> = (props) => {
  const [mensaje, setMensaje] = useState<string>();

  const enviarMensaje = async () => {
    try {
      if (!mensaje) return message.warning("No puedes enviar un mensaje vacío");
      if (!props.receiverUser)
        return message.warning("No hay un usuario seleccionado");
      if (!props.currentUser)
        return message.warning("No hay un usuario seleccionado");
      await axiosApp.post(
        `/v1/publico/usuarios/${props.currentUser._id}/mensaje/${props.receiverUser}`,
        {
          mensaje: encriptarMensaje({
            mensaje,
            publicKey: props.currentUser?.publicKey!,
          }),
        }
      );
      setMensaje("");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    setMensaje("");
  }, [props.receiverUser]);

  return (
    <div className="bg-whte h-full">
      <div className="h-full">
        <div className="flex h-14 items-center px-2">
          {!props.receiverUser ? (
            <Typography.Text className="text-white">
              Selecciona un usuario
            </Typography.Text>
          ) : (
            <div>
              <Avatar src={props.receiverUser?.avatar} />
              <Typography.Text className="ml-2 text-gray-200">
                {props.receiverUser?.username}
              </Typography.Text>
            </div>
          )}
        </div>
        <div
          className={`h-${
            props.receiverUser ? "[665px]" : "[690px]"
          } overflow-y-scroll`}
        >
          <Mensaje
            texto="Este es un mensaje a la izquierda"
            alineacion="izquierda"
          />
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />{" "}
          <Mensaje
            texto="Este es un mensaje a la derecha"
            alineacion="derecha"
          />
        </div>

        {props.receiverUser ? (
          <div className="bg-[#202c35] flex h-16 items-center justify-center">
            <Input
              value={mensaje}
              placeholder="Escribe un mensaje"
              onChange={(e) => setMensaje(e.target.value)}
            />
            <Button
              icon={<SendOutlined />}
              type="link"
              onClick={enviarMensaje}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatPage;
