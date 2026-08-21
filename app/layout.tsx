import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Central dos Imóveis JF — O futuro do mercado imobiliário",
  description:
    "O marketplace imobiliário que usa IA para conectar clientes e corretores automaticamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className="antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
