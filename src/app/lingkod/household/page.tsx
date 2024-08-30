import React from "react";
import { columns, HouseholdDetail } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";

type Props = {};

const Household = (props: Props) => {
  const data: HouseholdDetail[] = [
    {
      id: "123412344",
      household_head: "Test Y. Sheesh",
      address: "Zone 3, Undefined, Napo",
      member_no: 12341234,
      contact_no: "09123123123",
    },
  ];
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Household</h3>

      <DataTable columns={columns} data={data} />
    </section>
  );
};

export default Household;
