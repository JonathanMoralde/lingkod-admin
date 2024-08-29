import { DocRequest, columns } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { getData } from "./actions";

const Request = async () => {
  const requests: DocRequest[] = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Document Requests</h3>

      {/* <PdfBtn /> */}

      <DataTable columns={columns} data={requests} />
    </section>
  );
};

export default Request;
