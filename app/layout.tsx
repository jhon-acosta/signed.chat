import type { Metadata } from "next";
import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import { FC, PropsWithChildren } from "react";
import ProviderLayout from "@/components/layouts/ProviderLayout";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Signed Chat",
  description: "Envio de mensajes firmados con clave pública",
};

const RootLayout: FC<PropsWithChildren> = (props) => {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ConfigProvider theme={{ token: { colorPrimary: "#0c1317" } }}>
          <ProviderLayout>{props.children}</ProviderLayout>
        </ConfigProvider>
      </body>
    </html>
  );
};

export default RootLayout;
