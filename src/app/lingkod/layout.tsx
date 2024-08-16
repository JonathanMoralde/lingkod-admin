"use client";
import HeaderBar from "@/components/lingkod/headerbar";
import Sidebar from "@/components/lingkod/sidebar";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      {!user ? (
        <main className="grid place-items-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin" />
        </main>
      ) : (
        <div className="bg-indigo-900 min-h-screen overflow-hidden flex py-10">
          <Sidebar />
          <main className="mx-4 w-full h-full">
            {/* header bar */}
            <HeaderBar />

            {children}
          </main>
        </div>
      )}
    </>
  );
};

export default layout;
