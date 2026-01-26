import type { Metadata } from "next";
import "./globals.css";
import MainWrapper from "@/components/MainWrapper";

export const metadata: Metadata = {
  title: "PlayNova",
  description: "Your Professional Entertainment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
