import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CadasPatas",
  description: "Plataforma para ONGs de resgate de animais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
