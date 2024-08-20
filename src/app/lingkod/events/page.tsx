import React from "react";
import EventCard from "./eventCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Event, getData } from "./actions";
import { ScrollArea } from "@/components/ui/scroll-area";

const Events = async () => {
  const data: Event[] = await getData();

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl h-[80vh]">
      <div className="py-10 px-4">
        <div className="mb-6 flex justify-between">
          <h3 className="text-xl font-semibold ">Events</h3>

          <Link href="/lingkod/events/new">
            <Button
              variant="default"
              className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 "
            >
              New Event
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap w-full gap-4">
          {data.map((event, index) => (
            <EventCard
              title={event.event_title}
              description={event.description}
              event_date={event.event_date}
              event_pic={event.event_pic}
              id={event.id}
              key={index}
            />
          ))}
          {/* <EventCard title="" /> */}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Events;
