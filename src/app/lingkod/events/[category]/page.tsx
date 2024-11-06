"use client";

import React, { useEffect, useState } from "react";
import EventCard from "./eventCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterBtn from "./filterBtn";

// firebase
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  where,
  query,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  params: {
    category: string;
  };
};

export interface EventDetails {
  id: string;
  event_title: string;
  description: string;
  category: string;
  event_date: number;
  event_pic: string;
  event_time?: string;
  event_location?: string;
}

const Events = ({ params }: Props) => {
  const { category } = params;
  const [data, setData] = useState<EventDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let eventRef = query(
          collection(db, "events"),
          orderBy("event_date", "desc")
        );

        if (category !== "all") {
          const selectedCategory = `${category
            .charAt(0)
            .toUpperCase()}${category.slice(1).toLowerCase()}`;
          console.log(selectedCategory);
          eventRef = query(
            collection(db, "events"),
            where("category", "==", selectedCategory),
            orderBy("event_date", "desc")
          );
        }
        const eventSnapshot = await getDocs(eventRef);

        const events: EventDetails[] = eventSnapshot.docs.map((doc) => {
          const docData = doc.data();

          let eventData: EventDetails = {
            id: doc.id,
            event_title: docData.title as string, // Omit 'id' from the User type to avoid conflicts
            description: docData.description as string,
            event_date: (docData.event_date as Timestamp).toMillis(),
            event_pic: docData.event_pic as string,
            category: docData.category,
          };

          if (docData.category == "Events") {
            eventData.event_location = docData.event_location;
            eventData.event_time = docData.event_time;
          }
          return eventData;
        });

        setData(events);
      } catch (error) {
        console.error("Error fetching events data: ", error);
        toast.error(`Error fetching events data`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDel = (index: number) => {
    let tempData = data;
    tempData.splice(index, 1);
    setData([...tempData]);
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl min-h-[80vh]">
      {loading ? (
        <div className="w-full h-[80vh] grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="py-10 px-4">
          <div className="md:mb-2 mb-4 flex justify-between">
            <h3 className="text-lg md:text-xl font-semibold ">Events</h3>

            <Link href="/lingkod/events/new">
              <Button
                variant="default"
                className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 "
              >
                New Event
              </Button>
            </Link>
          </div>

          <FilterBtn currentCategory={category} />

          <div className="flex justify-center lg:justify-start flex-col md:flex-row md:flex-wrap w-full gap-4">
            {data.map((event, index) => (
              <EventCard
                title={event.event_title}
                description={event.description}
                event_date={event.event_date}
                event_pic={event.event_pic}
                event_location={event.event_location}
                event_time={event.event_time}
                id={event.id}
                handleDel={handleDel}
                index={index}
                key={index}
              />
            ))}
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default Events;
