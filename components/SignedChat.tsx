"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { Avatar, Button, Input, Typography, message } from "antd";
import { Chat, ChatVista, UsuarioChat } from "@/types/UsuariosChat";
import { axiosApp, desencriptarMensaje, encriptarMensaje } from "@/lib/utils";
import { LockOutlined, MessageOutlined, SendOutlined } from "@ant-design/icons";

const Mensaje: FC<{
  chat: ChatVista;
}> = (props) => {
  const alineacionClase =
    props.chat.alineacion === "derecha" ? "text-right" : "text-left";

  return (
    <div className={`my-2 ${alineacionClase} text-wrap`}>
      <div
        className={`${
          props.chat.mensaje !== "Mensaje privado"
            ? "bg-blue-500"
            : "bg-yellow-600"
        } text-white p-2 rounded-md shadow-md inline-block mx-1 w-64 m-2`}
      >
        <div className="flex justify-between text-[9px]">
          <div>De: {props.chat.from}</div>
          <div>
            Para: {props.chat.to} <LockOutlined />
          </div>
        </div>
        <div>{props.chat.mensaje}</div>
        <div className="flex justify-end text-[9px]">{props.chat.fecha}</div>
      </div>
    </div>
  );
};

const ChatPage: FC<{
  chats: Chat[];
  currentUser?: UsuarioChat;
  receiverUser?: UsuarioChat;
}> = (props) => {
  const [mensaje, setMensaje] = useState<string>();
  const [loadingMensaje, setLoadingMensaje] = useState(false);

  const enviarMensaje = async () => {
    try {
      if (!mensaje) return message.warning("No puedes enviar un mensaje vacío");
      if (!props.receiverUser)
        return message.warning("No hay un usuario seleccionado");
      if (!props.currentUser)
        return message.warning("No hay un usuario seleccionado");
      setLoadingMensaje(true);
      await axiosApp.post(
        `/v1/publico/usuarios/${props.currentUser._id}/mensaje/${props.receiverUser._id}`,
        {
          mensaje: encriptarMensaje({
            mensaje,
            key: props.currentUser?.publicKey!,
          }),
        }
      );
      setMensaje("");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingMensaje(false);
    }
  };

  const chatsRealTime = useMemo(() => {
    const chats: ChatVista[] = [];
    for (const chat of props.chats) {
      try {
        const mensaje2Descencriptado = desencriptarMensaje({
          messageBase64: chat.from.mensaje,
          key: props.currentUser?.publicKey!,
        });
        chats.push({
          from: chat.from.username,
          to: chat.to.username,
          alineacion: "derecha",
          mensaje: mensaje2Descencriptado,
          fecha: chat.fecha,
        });
      } catch (error) {
        try {
          const mensajeDescencriptado = desencriptarMensaje({
            messageBase64: chat.to.mensaje,
            key: props.currentUser?.publicKey!,
          });
          chats.push({
            from: chat.from.username,
            to: chat.to.username,
            mensaje: mensajeDescencriptado,
            alineacion: "izquierda",
            fecha: chat.fecha,
          });
        } catch (error) {
          chats.push({
            from: chat.from.username,
            to: chat.to.username,
            mensaje: "Mensaje privado",
            alineacion: "izquierda",
            fecha: chat.fecha,
          });
        }
      }
    }
    return chats;
  }, [props.chats, props.currentUser]);

  useEffect(() => {
    setMensaje("");
  }, [props.receiverUser]);

  return (
    <div className="bg-whte h-full">
      <div className="h-full">
        <div className="flex h-14 items-center px-2">
          {!props.receiverUser ? (
            <Typography.Text className="text-white" strong>
              Selecciona un usuario con quien chatear <MessageOutlined />
            </Typography.Text>
          ) : (
            <div>
              <Avatar src={props.receiverUser?.avatar} />
              <Typography.Text className="ml-2 text-gray-200">
                @{props.receiverUser?.username}
              </Typography.Text>
            </div>
          )}
        </div>
        <div className="h-[675px]">
          {chatsRealTime.map((chat, index) => (
            <Mensaje key={index} chat={chat} />
          ))}
        </div>

        <div className="bg-[#202c35] flex h-16 items-center justify-center">
          <Input
            value={mensaje}
            placeholder="Escribe un mensaje"
            onChange={(e) => setMensaje(e.target.value)}
            maxLength={120}
          />
          <Button
            icon={<SendOutlined />}
            type="link"
            onClick={enviarMensaje}
            loading={loadingMensaje}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
