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
import Link from "next/link";

type Props = {};

const EventCard = (props: Props) => {
  return (
    <Card className="w-1/4 h-80  rounded-xl overflow-hidden me-4 mb-4">
      <CardHeader className="relative w-full h-1/2 mt-0 space-y-0">
        {/* <div className="relative w-[81.25rem] h-[81.25rem]"> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="z-20 absolute right-0 top-0">
            <Button variant="ghost" size="icon">
              {/* //className="h-8 w-8 p-0" */}
              <span className="sr-only">Open menu</span>
              <MoreVertical />
              {/*  className="h-4 w-4" */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-[#4844B4] me-4">
            <DropdownMenuItem>
              <Link href={`/lingkod/residents/`}>Edit Event</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete Event</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 z-20 "
        >
          <MoreVertical />
        </Button> */}
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-[#00000054]"></div>
        <Image
          className="my-0 "
          src="/5963199c341c8453aad485bb333c5dee.png"
          alt="Background Image"
          fill
          sizes="w-auto h-auto"
          objectFit="cover"
        />
        {/* </div> */}
      </CardHeader>
      <CardContent className="py-4 h-1/2 overflow-ellipsis bg-[#4844B4] flex flex-col justify-between">
        {/* title */}
        <h3 className="truncate">Inter Barangay Basketball Tournament</h3>

        {/* Content */}
        <p className="text-sm font-light line-clamp-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
          molestiae soluta ea ipsa blanditiis quas natus aliquam error delectus
          consectetur! Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.
        </p>

        <p className="text-sm italic">March 6, 2024</p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
