"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = { currentCategory: string };

const FilterBtn = ({ currentCategory }: Props) => {
  const router = useRouter();

  const handleSelectChange = (value: string) => {
    // Navigate to the appropriate page based on the selected value
    router.push(`/lingkod/events/${value.toLowerCase()}`);
  };

  return (
    <div className="mb-6 w-1/4 flex gap-4 items-center">
      <p className="font-light">Filter:</p>
      <Select
        onValueChange={handleSelectChange}
        value={
          currentCategory !== "all"
            ? currentCategory.charAt(0).toUpperCase() +
              currentCategory.slice(1).toLowerCase()
            : undefined
        }
      >
        <SelectTrigger className="w-full dark:bg-transparent dark:border-gray-300 rounded dark:focus:outline-none ">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="rounded dark:bg-[#4844B4]">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="News">News</SelectItem>
          <SelectItem value="Events">Events</SelectItem>
          <SelectItem value="Updates">Updates</SelectItem>
          <SelectItem value="Alerts">Alerts</SelectItem>
          <SelectItem value="Notifications">Notifications</SelectItem>
          <SelectItem value="Reminders">Reminders</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBtn;
