import React, { ReactNode } from "react";
import Header from "./Header";
import SideNav from "./SideNav";

interface MainLayoutProps {
  children: ReactNode;
  sidenav_hidden?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidenav_hidden,
}) => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {sidenav_hidden ? null : <SideNav />}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
