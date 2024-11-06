"use client";
import React from "react";
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
      <section className="bg-indigo-950 rounded-xl px-4 py-10 lg:h-[80vh]">
        <h3 className="text-lg md:text-xl font-semibold mb-4 lg:mb-10">
          Account Settings
        </h3>

        <div className="flex flex-col lg:flex-row lg:h-5/6">
          <div className="flex lg:flex-col lg:w-1/4 gap-2 mb-2 lg:mb-0">
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
            orientation={window.innerWidth <= 820 ? "horizontal" : "vertical"}
            className="bg-[#ffffff65]  w-full lg:h-auto lg:w-[1px]  my-4 mb-4 lg:mb-0 lg:my-0 lg:mx-4"
          />
          <div className="w-full ">{children}</div>
        </div>
      </section>
    </>
  );
};

export default layout;
