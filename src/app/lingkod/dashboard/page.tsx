"use client";

import React, { useEffect, useState } from "react";
import ReportCard from "./report";
import {
  FaUsers,
  FaExclamationTriangle,
  FaFileDownload,
  FaCalendar,
} from "react-icons/fa";

import { db } from "@/config/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface dashboardCount {
  residentCount: number;
  reportCount: number;
  requestCount: number;
  eventCount: number;
}

const Dashboard = () => {
  const [dashboardCount, setDashboardCount] = useState<dashboardCount>({
    residentCount: 0,
    reportCount: 0,
    requestCount: 0,
    eventCount: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // FETCH RESIDENT COUNT
        const userQuery = query(
          collection(db, "users"),
          where("role", "==", "user")
        );
        const userQuerySnapshot = await getDocs(userQuery);
        const userCount = userQuerySnapshot.size;

        // FETCH BLOTTER COUNT
        const reportsCollection = query(collection(db, "blotter_reports"));
        const reportsQuerySnapshot = await getDocs(reportsCollection);
        const reportsCount = reportsQuerySnapshot.size;

        // FETCH REQUEST COUNT
        const requestsCollection = query(collection(db, "requests"));
        const requestQuerySnapshot = await getDocs(requestsCollection);
        const requestsCount = requestQuerySnapshot.size;

        // FETCH EVENT COUNT
        const eventsCollection = query(collection(db, "events"));
        const eventsQuerySnapshot = await getDocs(eventsCollection);
        const eventsCount = eventsQuerySnapshot.size;

        // Update state with the fetched data
        setDashboardCount({
          residentCount: userCount,
          reportCount: reportsCount,
          requestCount: requestsCount,
          eventCount: eventsCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
        toast.error(`Error fetching dashboard data`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-indigo-950 rounded-xl px-6 md:px-4 py-10  md:h-[80vh]">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
            Welcome, Admin!
          </h3>

          <div className="relative grid grid-cols-1 md:grid-cols-2 w-full md:w-3/4 gap-4 mx-auto ">
            <ReportCard
              title="Profiles"
              description="Total Residents"
              data={dashboardCount.residentCount}
              icon={<FaUsers className="text-4xl md:text-6xl text-center" />}
              route="residents"
            />
            <ReportCard
              title="Blotter Reports"
              description="Total Blotter Reports"
              data={dashboardCount.reportCount}
              icon={<FaExclamationTriangle className="text-4xl md:text-6xl" />}
              route="reports"
            />
            <ReportCard
              title="Document Request"
              description="Total Document Request"
              data={dashboardCount.requestCount}
              icon={<FaFileDownload className="text-4xl md:text-6xl" />}
              route="request"
            />
            <ReportCard
              title="Events"
              description="Total Events"
              data={dashboardCount.eventCount}
              icon={<FaCalendar className="text-4xl md:text-6xl" />}
              route="events/all"
            />

            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] opacity-50 z-0">
              <div className="relative w-[20rem] h-[20rem] mb-10 rounded-full shadow-lg">
                <Image
                  src="/28d74124c3365e8a66a995661eaa8724.png"
                  alt="Lingkod Logo"
                  fill
                  sizes="w-auto h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
