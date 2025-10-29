import type { Metadata } from "next";
import { Suravaram, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "react-hot-toast";

const suravaram = Suravaram({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-nirmala',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-open-sans',
});


export const metadata: Metadata = {
  title: "jurieasy",
  description: "Crie contratos jurídicos profissionais em minutos com a Jurieasy. Plataforma segura e eficiente para advogados e empresas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${suravaram.variable} ${openSans.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
