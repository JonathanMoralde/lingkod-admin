import React from "react";
import { columns, Report } from "./columns";
import { Timestamp } from "firebase/firestore";
import { DataTable } from "@/components/lingkod/data-table";

const Reports = () => {
  const reports: Report[] = [
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH3",
      full_name: "Test Y Sheesh",
      date_submitted: Timestamp.now().toMillis(),
    },
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH4",
      full_name: "Test Y 2",
      date_submitted: Timestamp.now().toMillis(),
    },
  ];

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-full">
      <h3 className="text-xl font-semibold mb-2">Blotter Reports</h3>

      <DataTable columns={columns} data={reports} />
    </section>
  );
};

export default Reports;
