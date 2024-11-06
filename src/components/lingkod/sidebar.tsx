"use client";

import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaBolt,
  FaHome,
  FaTimes,
} from "react-icons/fa";

import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import { Button } from "../ui/button";
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

type Props = {
  showDrawer: boolean;
  toggleDrawer: () => void;
};

const Sidebar = ({ showDrawer, toggleDrawer }: Props) => {
  const { userDetails } = useAuth();
  console.log(userDetails);
  const pathname = usePathname();
  let navLinks: NavItem[] = [
    {
      name: "Dashboard",
      path: "/lingkod/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Residents Profile",
      path: "/lingkod/residents",
      icon: <FaUser />,
    },
    {
      name: "Household",
      path: "/lingkod/household",
      icon: <FaHome />,
    },
    {
      name: "Requests",
      path: "/lingkod/request",
      icon: <FaEnvelope />,
    },
    {
      name: "Blotter Reports",
      path: "/lingkod/reports",
      icon: <FaFileAlt />,
    },
    {
      name: "Events",
      path: "/lingkod/events/all",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Electric Bill",
      path: "/lingkod/bill",
      icon: <FaBolt />,
    },
  ];

  // Dynamically filter routes based on userDetails.position
  if (
    userDetails?.position !== "Captain" &&
    userDetails?.position !== "Secretary"
  ) {
    navLinks = navLinks.filter((link) =>
      ["Dashboard", "Events", "Electric Bill"].includes(link.name)
    );
  }
  console.log(showDrawer);

  return (
    <NavigationMenu
      // className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:right-0 max-md:bottom-0 ${
      //   showDrawer ? "max-md:translate-x-full" : ""
      // }max-md:translate-x-full transition-all z-20 px-16 py-10 lg:rounded-r-3xl bg-indigo-950 lg:px-5 lg:py-10 lg:max-w-xs flex-col items-start justify-start`}
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        showDrawer ? "translate-x-full" : ""
      } transition-all z-20 px-16 py-10 lg:relative lg:translate-x-0 lg:rounded-r-3xl bg-indigo-950 lg:px-5 lg:py-10 lg:max-w-xs flex-col items-start justify-start`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 lg:hidden"
        onClick={() => toggleDrawer()}
      >
        <FaTimes className="text-xl" />
      </Button>
      <div className="flex items-center w-full">
        <Image
          className="me-4"
          src="/linkod_logo.png"
          alt="Lingkod Logo"
          // layout="responsive"
          width={100}
          height={100}
          priority
        />
        <p className="text-lg font-semibold text-white">
          Serving Local Communities
        </p>
      </div>
      <Separator className="my-4 bg-gray-400" />
      <div className="w-full">
        <NavigationMenuList className="flex-col">
          {navLinks.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <NavigationMenuItem
                key={index}
                className={`mb-2 py-1 w-full rounded-full transition-all ${
                  isActive
                    ? "bg-[#4844b4ad] text-white"
                    : "hover:bg-[#e5e7eb2e]"
                }`}
                onClick={toggleDrawer}
              >
                <Link
                  href={item.path}
                  legacyBehavior
                  passHref
                  className="w-full"
                >
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} w-full`}
                  >
                    <span className="mr-5 text-xl transition-all">
                      {item.icon}
                    </span>
                    <p className="text-lg font-semibold">{item.name}</p>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
};

export default Sidebar;
