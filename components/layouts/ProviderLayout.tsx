"use client";
import axios from "axios";
import getIO from "@/lib/socket-io";
import CreateUser from "../CreateUser";
import Sider from "antd/es/layout/Sider";
import { UsuarioChat } from "@/types/UsuariosChat";
import { Menu, Layout, Avatar, Badge } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { FC, useMemo, useState, useEffect, PropsWithChildren } from "react";

const ProviderLayout: FC<PropsWithChildren> = (props) => {
  const [usersOnline, setUsersOnline] = useState<UsuarioChat[]>([]);
  const [receiverUser, setReceiverUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UsuarioChat | null>(null);

  const getUserLocalStorage = () => {
    const currentUser = localStorage.getItem("currentUser");
    setCurrentUser(
      !currentUser ? null : (JSON.parse(currentUser || "{}") as UsuarioChat)
    );
  };

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
          key: currentUser._id,
          icon: <Badge status={usersOnline.length > 0 ? "success" : "error"} />,
          label: `En línea (${usersOnline.length - 1})`,
          disabled: !!currentUser,
        } as never
      );
    }
    return data;
  }, [currentUser, usersOnline]);

  useEffect(() => {
    getUserLocalStorage();
    const getUsersOnline = async () => {
      try {
        const response = await axios.get<{ data: UsuarioChat[] }>(
          "/api/usuarios-chat"
        );
        setUsersOnline(response.data?.data || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUsersOnline();

    const io = getIO();
    io.on("getAllUsers", (users: UsuarioChat[]) => {
      setUsersOnline(users);
      setTimeout(() => {
        getUserLocalStorage();
      }, 100);
    });

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <Layout className="!min-h-screen bg-[#0c1317]">
      <Layout.Content className="flex px-40 py-20 rounded-3xl ">
        {!currentUser ? (
          <CreateUser />
        ) : (
          <>
            <Sider width={250}>
              <Menu
                mode="inline"
                theme="dark"
                items={items}
                style={{ height: "100%" }}
                className="bg-[#202c35]"
                onSelect={({ key }) => {
                  setReceiverUser(key);
                }}
              />
            </Sider>
            <Layout.Content className="bg-[#202c35] p-5">
              {props.children}
            </Layout.Content>
          </>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default ProviderLayout;
