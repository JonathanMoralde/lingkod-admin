"use client";
import HeaderBar from "@/components/lingkod/headerbar";
import Sidebar from "@/components/lingkod/sidebar";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showDrawer, setShowDawer] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const toggleDrawer = () => {
    setShowDawer(!showDrawer);
  };

  return (
    <>
      {!user ? (
        <main className="grid place-items-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin" />
        </main>
      ) : (
        <div className="bg-indigo-900 min-h-screen overflow-hidden flex py-10">
          <Sidebar showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
          <main className="w-full h-full px-4">
            {/* header bar */}
            <HeaderBar toggleDrawer={toggleDrawer} />

            {children}
          </main>
        </div>
      )}
    </>
  );
};

export default layout;
