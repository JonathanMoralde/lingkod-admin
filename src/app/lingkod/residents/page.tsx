import React from "react";

import { User, columns } from "./columns";
import { DataTable } from "../../../components/lingkod/data-table";

const Residents = () => {
  const payments: User[] = [
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH3",
      full_name: "Test Y Sheesh",
      zone: "3",
      status: "pending",
      email: "test@gmail.com",
    },
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH4",
      full_name: "Test 2",
      zone: "1",
      status: "pending",
      email: "test2@gmail.com",
    },
    // ...
  ];

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-full">
      <h3 className="text-xl font-semibold mb-2">Records</h3>

      <DataTable columns={columns} data={payments} />
    </section>
  );
};

export default Residents;
