import React from "react";
import { Navbar } from "./Navbar";
import NextTopLoader from "nextjs-toploader";

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NextTopLoader
        color="#007bff"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #007bff,0 0 5px #007bff"
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default MainWrapper;
