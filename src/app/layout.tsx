import type { Metadata } from "next";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import ThemeProvider from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/layout-provider";
import ReduxProvider from "@/providers/redux-provider";
import { NextUIProvider } from "@nextui-org/react";


export const metadata: Metadata = {
  title: "Rapid Chat",
  description: "Real Time Chat Application",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/loginLogo.svg",
        }
      }}
    >
      <html lang="en">
        <body>
          <ThemeProvider>
            <ReduxProvider><LayoutProvider>
              <NextUIProvider>
              {children}
              </NextUIProvider>
            </LayoutProvider></ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
