"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { handleDelete } from "./actions";
import { toast } from "sonner";

type Props = {
  id: string;
  title: string;
  description: string;
  event_date: number;
  event_pic: string;
};

const EventCard = (props: Props) => {
  const deleteEvent = async (id: string) => {
    try {
      await handleDelete(id);
      toast.success("Successfully deleted the event!");
    } catch (error) {
      toast.error("Failed to delete the event!");
    }
  };
  return (
    <Card className="w-[23%] h-80 rounded-xl overflow-hidden">
      <CardHeader className="relative w-full h-1/2 mt-0 space-y-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="z-20 absolute right-0 top-0">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-[#4844B4] me-4">
            <Link href={`/lingkod/events/${props.id}`}>
              <DropdownMenuItem>Edit Event</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => deleteEvent(props.id)}>
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-[#00000054]"></div>
        <Image
          className="my-0 object-cover"
          src={props.event_pic}
          alt="Background Image"
          fill
          sizes="w-auto h-auto"
          priority
        />
      </CardHeader>
      <CardContent className="py-4 h-1/2 bg-[#4844B4] flex flex-col justify-between">
        {/* title */}
        <h3 className="truncate">{props.title}</h3>

        {/* Content */}
        <p className="text-sm font-light line-clamp-3 break-words">
          {props.description}
        </p>

        <p className="text-sm italic">
          {format(new Date(props.event_date), "MMMM dd, yyyy")}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
