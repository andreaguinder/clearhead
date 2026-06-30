import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'ClearHead',
  description: 'Tu tablero Kanban inteligente. Organiza tus tareas de forma visual y eficiente.',
  manifest: '/manifest.json',
  

  icons: {
    icon: '/favicon.png', // Para navegadores de escritorio
    shortcut: '/favicon.png',
    apple: '/apple-icon.png', //  Este es el que usa iOS para la pantalla de inicio
  },

  // 2. OPEN GRAPH (Para cuando compartís el link por WhatsApp / Redes)
  openGraph: {
    title: 'ClearHead Kanban',
    description: 'El mejor organizador para vaciar tu mente.',
    url: 'https://tu-dominio.com', // Cambialo por tu URL real de Vercel cuando lo subas
    siteName: 'ClearHead',
    images: [
      {
        url: '/og-image.png', //  La imagen que se va a ver en el mensaje de WhatsApp
        width: 1200,
        height: 630,
        alt: 'Vista previa de ClearHead Kanban',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },

  // 3. META EXCLUSIVA PARA EL COMPORTAMIENTO APP DE APPLE
  appleWebApp: {
    capable: true,
    title: 'ClearHead',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
