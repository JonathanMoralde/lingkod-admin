import React from "react";
import { columns, Report } from "./columns";
import { Timestamp } from "firebase/firestore";
import { DataTable } from "@/components/lingkod/data-table";
import { getData } from "./actions";

export const dynamic = "force-dynamic";

const Reports = async () => {
  const reports: Report[] = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Blotter Reports</h3>

      <DataTable columns={columns} data={reports} />
    </section>
  );
};

export default Reports;
