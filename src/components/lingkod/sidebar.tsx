"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaBolt,
  FaHome,
} from "react-icons/fa";

import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
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

  return (
    <NavigationMenu className="rounded-r-3xl bg-indigo-950 px-5 py-10 max-w-xs flex-col items-start justify-start">
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
