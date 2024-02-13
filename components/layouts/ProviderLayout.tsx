"use client";
import axios from "axios";
import CreateUser from "../CreateUser";
import Sider from "antd/es/layout/Sider";
import { User } from "@/api/models/User";
import { Menu, Layout, Avatar, Badge } from "antd";
import { socketClient } from "../SignedChat";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { FC, useMemo, useState, useEffect, PropsWithChildren } from "react";

interface UserDocument extends User {
  _id: string;
}

const ProviderLayout: FC<PropsWithChildren> = (props) => {
  const [usersOnline, setUsersOnline] = useState<UserDocument[]>([]);
  const [receiverUser, setReceiverUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDocument | null>(null);

  const getUserLocalStorage = () => {
    const currentUser = localStorage.getItem("currentUser");
    setCurrentUser(
      !currentUser ? null : (JSON.parse(currentUser || "{}") as UserDocument)
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
        const response = await axios.get<{ data: UserDocument[] }>(
          "/api/users"
        );
        setUsersOnline(response.data?.data || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUsersOnline();

    const socket = socketClient();
    socket.on("getAllUsers", (users: UserDocument[]) => {
      setUsersOnline(users);
      setTimeout(() => {
        getUserLocalStorage();
      }, 100);
    });

    return () => {
      socket.disconnect();
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
