import React from "react";
import ReportCard from "./report";
import {
  FaUsers,
  FaExclamationTriangle,
  FaFileDownload,
  FaCalendar,
} from "react-icons/fa";
import {
  getBlotterCount,
  getEventsCount,
  getRequestsCount,
  getResidentCount,
} from "./action";

const Dashboard = async () => {
  const residentCount = await getResidentCount();
  const reportsCount = await getBlotterCount();
  const requestsCount = await getRequestsCount();
  const eventsCount = await getEventsCount();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-3xl font-semibold mb-6 text-center">
        Welcome, Admin!
      </h3>

      <div className="grid grid-cols-2 w-3/4 gap-4 mx-auto">
        <ReportCard
          title="Profiles"
          description="Total Residents"
          data={residentCount}
          icon={<FaUsers size={50} />}
        />
        <ReportCard
          title="Blotter Reports"
          description="Total Blotter Reports"
          data={reportsCount}
          icon={<FaExclamationTriangle size={50} />}
        />
        <ReportCard
          title="Document Request"
          description="Total Document Request"
          data={requestsCount}
          icon={<FaFileDownload size={50} />}
        />
        <ReportCard
          title="Events"
          description="Total Events"
          data={eventsCount}
          icon={<FaCalendar size={50} />}
        />
      </div>
    </section>
  );
};

export default Dashboard;
