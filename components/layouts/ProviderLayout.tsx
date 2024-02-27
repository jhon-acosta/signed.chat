"use client";
import getIO from "@/lib/socket-io";
import ChatPage from "../SignedChat";
import CreateUser from "../CreateUser";
import Sider from "antd/es/layout/Sider";
import { Socket } from "socket.io-client";
import { UsuarioChat } from "@/types/UsuariosChat";
import { Menu, Layout, Avatar, Badge } from "antd";
import { axiosApp, getUsuarioLocalStg } from "@/lib/utils";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { FC, useMemo, useState, useEffect, PropsWithChildren } from "react";

const ProviderLayout: FC<PropsWithChildren> = (props) => {
  const [io, setIO] = useState<Socket>();
  const [currentUser, setCurrentUser] = useState<UsuarioChat>();
  const [receiverUser, setReceiverUser] = useState<UsuarioChat>();
  const [usersOnline, setUsersOnline] = useState<UsuarioChat[]>([]);

  const items = useMemo((): ItemType<MenuItemType>[] => {
    const data = usersOnline
      .filter((item) => item._id !== currentUser?._id)
      .map((item) => ({
        key: item._id,
        icon: <Avatar src={item.avatar} />,
        label: item.username,
      }));
    if (currentUser) {
      data.unshift(
        {
          key: currentUser._id,
          icon: <Avatar src={currentUser.avatar} />,
          label: `${currentUser.username} (Tú)`,
          disabled: !!currentUser,
        } as never,
        {
          key: "en-linea",
          icon: <Badge status={usersOnline.length > 0 ? "success" : "error"} />,
          label: `En línea (${usersOnline.length - 1})`,
          disabled: !!currentUser,
        } as never
      );
    }
    return data;
  }, [currentUser, usersOnline]);

  useEffect(() => {
    setCurrentUser(getUsuarioLocalStg());

    const getUsersOnline = async () => {
      try {
        const response = await axiosApp.get<UsuarioChat[]>(
          "/v1/publico/usuarios"
        );
        setUsersOnline(response?.data || []);
        if (response?.data.length > 2) setReceiverUser(response?.data[0]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUsersOnline();

    const io = getIO();
    setIO(io);
    io.on("usuarios-online", (users: UsuarioChat[]) => {
      if (users.length > 2) setReceiverUser(users[1]);
      setUsersOnline(users);
      setTimeout(() => {
        setCurrentUser(getUsuarioLocalStg());
      }, 100);
    });
    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <Layout className="!min-h-screen bg-[#0c1317]">
      <Layout.Content className="flex px-5 md:px-40 md:py-20 rounded-3xl ">
        {!currentUser ? (
          <CreateUser />
        ) : (
          <>
            <Sider width={200} breakpoint="lg" collapsedWidth="0">
              <Menu
                mode="inline"
                theme="dark"
                items={items}
                style={{ height: "100%" }}
                className="bg-[#202c35]"
                onSelect={(seleccionado) => {
                  setReceiverUser(
                    usersOnline.find((user) => user._id === seleccionado.key)
                  );
                }}
              />
            </Sider>
            <Layout.Content className="bg-[#202b30] ">
              <ChatPage
                io={io}
                currentUser={currentUser}
                receiverUser={receiverUser}
              />
            </Layout.Content>
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default ProviderLayout;
