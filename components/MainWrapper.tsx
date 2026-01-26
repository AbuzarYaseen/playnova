import { Providers } from "@/app/providers";
import React from "react";
import { Navbar } from "./Navbar";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </Providers>
  );
};

export default MainWrapper;
