import type { Metadata } from "next";
import { Suravaram, Open_Sans } from 'next/font/google';
import './globals.css';

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
    <html lang="en">
      <body
        className={`${suravaram.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
