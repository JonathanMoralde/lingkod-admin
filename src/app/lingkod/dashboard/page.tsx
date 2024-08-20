import React from "react";
import ReportCard from "./report";
import {
  FaUsers,
  FaExclamationTriangle,
  FaFileDownload,
  FaCalendar,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-3xl font-semibold mb-6 text-center">
        Welcome, Admin!
      </h3>

      <div className="grid grid-cols-2 w-3/4 gap-4 mx-auto">
        <ReportCard
          title="Profiles"
          description="Total Residents"
          data={5}
          icon={<FaUsers size={50} />}
        />
        <ReportCard
          title="Blotter Reports"
          description="Total Blotter Reports"
          data={1}
          icon={<FaExclamationTriangle size={50} />}
        />
        <ReportCard
          title="Document Request"
          description="Total Document Request"
          data={2}
          icon={<FaFileDownload size={50} />}
        />
        <ReportCard
          title="Events"
          description="Total Events"
          data={3}
          icon={<FaCalendar size={50} />}
        />
      </div>
    </section>
  );
};

export default Dashboard;
