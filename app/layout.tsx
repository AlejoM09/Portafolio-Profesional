import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Julio Alejandro Marín — Portfolio",
  description: "Estudiante de Ingeniería de Sistemas | Desarrollo de Software · UI/UX · Ciberseguridad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
