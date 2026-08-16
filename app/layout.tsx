"use client";
import "./globals.css"
import Providers from "./src/components/provider";
import "@/app/src/api/config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}