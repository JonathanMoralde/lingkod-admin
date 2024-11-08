"use client";

import React, { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Image from "next/image";
import { Loader2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { format } from "date-fns";

import Link from "next/link";
import { db, storage } from "@/config/firebase";
import { ref, deleteObject } from "firebase/storage";
import {
  collection,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "sonner";

type Props = {
  id: string;
  title: string;
  description: string;
  event_date: number;
  event_pic: string;
  handleDel: (index: number) => void;
  index: number;
  event_time?: string;
  event_location?: string;
};

const EventCard = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteEvent = async (id: string) => {
    setIsLoading(true);
    try {
      const documentRef = doc(collection(db, "events"), id);

      const docSnapshot = await getDoc(documentRef);
      if (docSnapshot.exists()) {
        const eventData = docSnapshot.data();

        const formattedDate = format(
          new Date((eventData?.event_date as Timestamp).toMillis()),
          "MM-dd-yyyy"
        );

        await deleteDoc(documentRef);

        // DELETE ALSO THE REMINDERS LINKED TO THIS EVENT
        const reminderQuery = query(
          collection(db, "reminders"),
          where("event_doc_id", "==", id)
        );

        // Fetch the reminders that match the query
        const querySnapshot = await getDocs(reminderQuery);

        // Delete each document found in the query
        const deletePromises = querySnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);

        // Delete the image from Firebase Storage
        const storagePath = `events/${eventData?.title}/${formattedDate}/event_image`;
        const imageRef = ref(storage, storagePath); // Create a reference to the image

        await deleteObject(imageRef); // Delete the image
        props.handleDel(props.index);
        toast.success("Successfully deleted the event!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the event!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="md:w-[31%] lg:w-[23%] h-96 rounded-xl overflow-hidden">
      <CardHeader className="relative w-full h-1/2 mt-0 space-y-0">
        {isLoading ? (
          <Loader2 className="h-10 w-10 animate-spin z-20 absolute right-0 top-0" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="z-20 absolute right-0 top-0"
            >
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-[#4844B4] me-4">
              <Link href={`/lingkod/events/new/${props.id}`}>
                <DropdownMenuItem>Edit Event</DropdownMenuItem>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:hover:bg-slate-800 w-full">
                  {" "}
                  Delete Event
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-[#4844B4]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      You are about to delete an event
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove
                      the event from the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950"
                      onClick={() => {
                        deleteEvent(props.id);
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
        <p className="text-sm font-light line-clamp-3 break-words text-gray-400">
          {props.description}
        </p>

        <div>
          <p className="text-sm italic text-gray-300">
            {format(new Date(props.event_date), "MMMM dd, yyyy")}
            {props.event_time != null ? ` - ${props.event_time}` : ""}
          </p>
          {props.event_location != null ? (
            <p className="text-sm text-gray-300">{props.event_location}</p>
          ) : (
            ""
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
