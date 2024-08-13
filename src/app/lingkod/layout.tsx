import HeaderBar from "@/components/lingkod/headerbar";
import Sidebar from "@/components/lingkod/sidebar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="bg-indigo-900 min-h-screen overflow-hidden flex py-10">
        <Sidebar />
        <main className="mx-4 w-full h-full">
          {/* header bar */}
          <HeaderBar />

          {children}
        </main>
      </div>
    </>
  );
};

export default layout;
