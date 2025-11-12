// app/layout.tsx
import type { Metadata } from "next";
import { Suravaram, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import GoogleProvider from "./providers/GoogleProvider";
import { UserProvider } from "@/contexts/UserContext";
import { UserDocumentProvider } from "@/contexts/UserDocumentContext";

const suravaram = Suravaram({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-nirmala",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "jurieasy",
  description:
    "Crie contratos jurídicos profissionais em minutos com a Jurieasy. Plataforma segura e eficiente para advogados e empresas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${suravaram.variable} ${openSans.variable} antialiased`}>
        <GoogleProvider>
          <UserProvider>
            <UserDocumentProvider>
              {children}

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: "10px",
                    background: "#2563EB",
                    color: "#fff",
                  },
                }}
              />
            </UserDocumentProvider>
          </UserProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}