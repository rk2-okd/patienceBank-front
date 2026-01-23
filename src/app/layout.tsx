"use client";

import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode}>) {
  const pathname = usePathname();
  const isTopPage = pathname === "/";
  const isLoginPage = pathname === "/login";
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        {(!isTopPage && !isLoginPage && <Header />)}
        <main>{children}</main>
      </body>
    </html>
  );
}
