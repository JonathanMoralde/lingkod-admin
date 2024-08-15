"use client";

import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";

const HeaderBar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

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

  return (
    <div className="bg-indigo-950 rounded-xl py-3 mb-4 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <FaCalendarAlt className="me-2 text-xl" />
        <p className="text-sm font-light leading-none">{`${dayOfWeek}, ${formattedDate} ${formattedTime}`}</p>
      </div>
      <div>
        <FaUserCircle className="text-xl" />
      </div>
    </div>
  );
};

export default HeaderBar;
