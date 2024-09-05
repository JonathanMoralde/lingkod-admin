import React from "react";
import { columns, HouseholdDetail } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { getData } from "./actions";

export const dynamic = "force-dynamic"; //! THIS REMOVES CACHING FOR THIS PAGE FIXING THE ISSUE OF NOT UPDATED DATA BEING DISPLAYED

const Household = async () => {
  const data: HouseholdDetail[] = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Household</h3>

      <DataTable columns={columns} data={data} />
    </section>
  );
};

export default Household;
