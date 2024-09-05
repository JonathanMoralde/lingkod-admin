import React, { useState } from "react";

import { User, columns } from "./columns";
import { DataTable } from "../../../components/lingkod/data-table";
import { getData } from "./actions";

export const dynamic = "force-dynamic";

const Residents = async () => {
  const data: User[] = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Records</h3>

      <DataTable columns={columns} data={data} />
    </section>
  );
};

export default Residents;
