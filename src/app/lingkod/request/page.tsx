import { DocRequest, columns } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { Timestamp } from "firebase/firestore";
import React from "react";
import PdfBtn from "./pdf-btn";

const Request = () => {
  const requests: DocRequest[] = [
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH3",
      full_name: "Test Y Sheesh",
      type: "Barangay Clearance",
      date_requested: Timestamp.now().toMillis(),
      status: "pending",
    },
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH4",
      full_name: "Test Y 2",
      type: "Business Permit",
      date_requested: Timestamp.now().toMillis(),
      status: "pending",
    },
  ];

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Document Requests</h3>

      <PdfBtn />

      <DataTable columns={columns} data={requests} />
    </section>
  );
};

export default Request;
