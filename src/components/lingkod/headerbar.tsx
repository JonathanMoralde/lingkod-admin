"use client";

import { Loader2, LogOut, Settings, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";

import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserCircle, FaBell } from "react-icons/fa";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import NotificationCard from "./notification-card";

export type NotificationData = {
  id: string;
  notif_msg: string;
  receiver_uid: string;
  type: string;
  timestamp: string;
};

const HeaderBar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

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

      // await deleteAuthCookie();

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

  const handleNotif = async () => {
    setLoading(true);
    console.log(user?.uid);
    try {
      const notifRef = query(
        collection(db, "notifications"),
        where("receiver_uid", "==", user?.uid),
        where("is_read", "==", false)
      );
      const notifSnapshot = await getDocs(notifRef);

      if (notifSnapshot.docs.length >= 1) {
        const data: NotificationData[] = notifSnapshot.docs.map((doc) => {
          const docData = doc.data();

          const timestamp = (docData.timestamp as Timestamp).toDate();
          const daysDifference = differenceInDays(new Date(), timestamp);

          // If the difference is 7 days or less, show "time ago"
          const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

          // If older than 7 days, show formatted date
          const formattedDate = format(timestamp, "MMMM dd, yyyy");

          // Decide which one to display
          const displayDate = daysDifference <= 7 ? timeAgo : formattedDate;

          return {
            id: doc.id,
            notif_msg: docData.notif_msg,
            receiver_uid: docData.receiver_uid,
            type: docData.type,
            timestamp: displayDate,
          };
        });

        setNotifications(data);
      } else {
        setNotifications([]); // Clear notifications if none are found
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to fetch notifications. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const notifRef = query(
          collection(db, "notifications"),
          where("receiver_uid", "==", user?.uid),
          where("is_read", "==", false)
        );
        const notifSnapshot = await getDocs(notifRef);

        if (notifSnapshot.docs.length >= 1) {
          const data: NotificationData[] = notifSnapshot.docs.map((doc) => {
            const docData = doc.data();

            const timestamp = (docData.timestamp as Timestamp).toDate();
            const daysDifference = differenceInDays(new Date(), timestamp);

            // If the difference is 7 days or less, show "time ago"
            const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

            // If older than 7 days, show formatted date
            const formattedDate = format(timestamp, "MMMM dd, yyyy");

            // Decide which one to display
            const displayDate = daysDifference <= 7 ? timeAgo : formattedDate;

            return {
              id: doc.id,
              notif_msg: docData.notif_msg,
              receiver_uid: docData.receiver_uid,
              type: docData.type,
              timestamp: displayDate,
            };
          });

          setNotifications(data);
        } else {
          setNotifications([]); // Clear notifications if none are found
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };

    fetchNotif(); //initial fetch

    const interval = setInterval(() => {
      fetchNotif();
    }, 10000); // 10 seconds

    // Clear interval when component unmounts
    return () => clearInterval(interval);
  }, [user]);

  const updateIsRead = async (id: string) => {
    try {
      const documentRef = doc(db, "notifications", id);
      await updateDoc(documentRef, { is_read: true });

      return { success: true };
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="bg-indigo-950 rounded-xl py-3 mb-4 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <FaCalendarAlt className="me-2 text-2xl" />
        <p className="text-sm font-light leading-none">{`${dayOfWeek}, ${formattedDate} ${formattedTime}`}</p>
      </div>
      <div className="flex">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              // onClick={handleNotif}
            >
              <FaBell className="text-xl" />
              {notifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-0 right-0 px-1.5 py-0 text-[0.6rem]"
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mr-[4rem] dark:bg-[#4844B4] bg-[#4844B4] p-2">
            <ScrollArea className="max-h-60">
              {loading ? (
                <Loader2 className="h-10 w-10 animate-spin mx-auto" />
              ) : notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notificationData={notif}
                      onClick={() => {
                        updateIsRead(notif.id);
                        let tempNotif = notifications;
                        console.log(tempNotif);
                        const filteredNotif = tempNotif.filter(
                          (n) => n.id !== notif.id
                        );
                        console.log(filteredNotif);
                        setNotifications([...filteredNotif]);
                        setPopoverOpen(false);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p>There are currently no new notifications</p>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <FaUserCircle className="text-2xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 dark:bg-[#4844B4] bg-[#4844B4] mr-10">
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
