import Sidebar from "@/components/lingkod/sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="bg-indigo-900 min-h-screen overflow-hidden flex">
        <Sidebar />
        {children}
      </div>
    </>
  );
};

export default layout;
