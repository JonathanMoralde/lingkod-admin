"use client";

import { LogOut, Settings, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAuthCookie } from "@/app/action";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const HeaderBar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const router = useRouter();
  const { user, logout, userDetails } = useAuth();

  useEffect(() => {
    // Set up an interval to update the date every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Get the day of the week
  const dayOfWeek = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Get the formatted date (MM/DD/YYYY)
  const formattedDate = currentDate.toLocaleDateString("en-US");

  // Get the formatted time (HH:MM AM/PM)
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLogout = async () => {
    try {
      // Sign out the user with Firebase
      await logout();

      await deleteAuthCookie();

      // Redirect to the login page or home page
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`error logging out. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className="bg-indigo-950 rounded-xl py-3 mb-4 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <FaCalendarAlt className="me-2 text-2xl" />
        <p className="text-sm font-light leading-none">{`${dayOfWeek}, ${formattedDate} ${formattedTime}`}</p>
      </div>
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <FaUserCircle className="text-2xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 dark:bg-[#4844B4] mr-10">
            <DropdownMenuLabel>{user?.email ?? "Loading"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/lingkod/settings/profile">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            {userDetails?.position === "Captain" ||
            userDetails?.position === "Secretary" ? (
              <DropdownMenuGroup>
                <Link href="/lingkod/officer-management">
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Officer Management</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            ) : (
              ""
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HeaderBar;
