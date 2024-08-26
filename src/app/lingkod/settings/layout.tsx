"use client";
import HeaderBar from "@/components/lingkod/headerbar";
import Sidebar from "@/components/lingkod/sidebar";
import React, { Children, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  return (
    <>
      <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
        <h3 className="text-xl font-semibold mb-10">Account Settings</h3>

        <div className="flex h-5/6">
          <div className="flex flex-col w-1/4 gap-2">
            <Link href="/lingkod/settings/profile">
              <Button
                className={`hover:bg-[#ffffff24] w-full flex justify-start rounded-full ${
                  pathname === "/lingkod/settings/profile"
                    ? "bg-[#4844b4ad] text-white"
                    : "hover:bg-[#e5e7eb2e]"
                }`}
              >
                Profile
              </Button>
            </Link>
            <Link href="/lingkod/settings/change-password">
              <Button
                className={`hover:bg-[#ffffff24] w-full flex justify-start rounded-full ${
                  pathname === "/lingkod/settings/change-password"
                    ? "bg-[#4844b4ad] text-white"
                    : "hover:bg-[#e5e7eb2e]"
                }`}
              >
                Change Password
              </Button>
            </Link>
          </div>
          <Separator
            orientation="vertical"
            className="bg-[#ffffff65] h-full mx-4"
          />
          <div className="w-full">{children}</div>
        </div>
      </section>
    </>
  );
};

export default layout;
