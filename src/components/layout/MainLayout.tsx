import React, { ReactNode } from "react";
import Header from "./Header";
import SideNav from "./SideNav";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
