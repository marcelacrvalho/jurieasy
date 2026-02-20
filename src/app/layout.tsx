// app/layout.tsx
import type { Metadata } from "next";
import { Suravaram, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import GoogleProvider from "./providers/GoogleProvider";
import { UserProvider } from "@/contexts/UserContext";
import { UserDocumentProvider } from "@/contexts/UserDocumentContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { Analytics } from "@vercel/analytics/next"

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
  // Meta Tags Básicas
  title: {
    default: "Jurieasy - Contratos jurídicos em minutos",
    template: "%s | Jurieasy"
  },
  description: "Crie contratos jurídicos profissionais em minutos com a Jurieasy. Plataforma segura e eficiente para advogados, empresas e profissionais liberais. Conformidade LGPD e atualizações automáticas.",
  keywords: [
    "contratos online",
    "modelos de contrato",
    "criação de contratos fácil",
    "criar contrato automaticamente",
    "contratos profissionais",
    "contrato de locação",
    "contrato de prestação de serviço",
    "contrato de eventos"
  ],
  authors: [{ name: "Jurieasy" }],
  creator: "Jurieasy",
  publisher: "Jurieasy",

  // Open Graph (Facebook, LinkedIn, etc)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://jurieasy.com",
    siteName: "Jurieasy",
    title: "Jurieasy - Contratos jurídicos em minutos",
    description: "Plataforma inteligente para criação de contratos profissionais com segurança jurídica e conformidade LGPD.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jurieasy - Plataforma de Contratos Inteligentes",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Jurieasy - Contratos jurídicos em jinutos",
    description: "Transforme horas em minutos na criação de contratos profissionais",
    images: ["/twitter-image.jpg"],
    creator: "@jurieasy",
    site: "@jurieasy",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Alternate Languages
  alternates: {
    canonical: "https://jurieasy.com",
    languages: {
      "pt-BR": "https://jurieasy.com",
      // "en-US": "https://jurieasy.com/en",
    },
  },

  // Verification
  verification: {},

  // Category
  category: "Legal Technology",

  // Outras Meta Tags
  metadataBase: new URL("https://jurieasy.com"),
  generator: "Next.js",
  applicationName: "Jurieasy",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Apple/Android
  appleWebApp: {
    capable: true,
    title: "Jurieasy",
    statusBarStyle: "black-translucent",
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },

  // Manifest
  manifest: "/manifest.json",

  // Viewport é adicionado automaticamente pelo Next.js
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        {/* Meta Tags adicionais que não estão no objeto metadata */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Preconnect para domínios externos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload para recursos críticos */}
        <link rel="preload" href="/landing-rocket.svg" as="image" type="image/svg+xml" />

        {/* Canonical dinâmico - será sobrescrito por páginas específicas */}
        <link rel="canonical" href="https://jurieasy.com" />

        {/* Structured Data em JSON-LD - Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Jurieasy",
              "url": "https://jurieasy.com",
              "description": "Plataforma inteligente para criação de contratos jurídicos profissionais",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://jurieasy.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Jurieasy",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://jurieasy.com/logo.png"
                }
              }
            })
          }}
        />
      </head>
      <body className={`${suravaram.variable} ${openSans.variable} antialiased`}>
        <GoogleProvider>
          <UserProvider>
            <UserDocumentProvider>
              <DocumentProvider>
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
              </DocumentProvider>
            </UserDocumentProvider>
          </UserProvider>
        </GoogleProvider>
        <Analytics />
      </body>
    </html>
  );
}