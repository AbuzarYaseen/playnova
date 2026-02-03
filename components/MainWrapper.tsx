import React from "react";
import { Navbar } from "./Navbar";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default MainWrapper;
