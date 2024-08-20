import React from "react";
import EventCard from "./eventCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Events = () => {
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
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

      <div className="flex flex-wrap w-full">{/* <EventCard /> */}</div>
    </section>
  );
};

export default Events;
