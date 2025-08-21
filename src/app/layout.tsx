import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { RefreshButton } from "@/components/layout/refresh-button";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blue Bird - Sistema de Monitoramento",
  description: "Plataforma inteligente de análise e monitoramento de comunicações empresariais",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Blue Bird",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/pwa-logo.svg",
  },

};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0ea5e9" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-background lg:ml-0">
            <div className="lg:hidden h-16 flex items-center px-16 border-b border-border bg-card">
              {/* Espaço para o botão mobile */}
            </div>
            {children}
          </main>
          <RefreshButton />
          <InstallPrompt />
          <OfflineIndicator />
        </div>
      </body>
    </html>
  );
}
