import React from "react";

import { User, columns } from "./columns";
import { DataTable } from "../../../components/lingkod/data-table";
import { getData } from "./actions";

const Residents = async () => {
  // const payments: User[] = [
  //   {
  //     id: "YiDEQ77g4CPpwoHpviyTzpKJBuH3",
  //     full_name: "Test Y Sheesh",
  //     zone: "3",
  //     status: "pending",
  //     email: "test@gmail.com",
  //   },
  //   {
  //     id: "YiDEQ77g4CPpwoHpviyTzpKJBuH4",
  //     full_name: "Test 2",
  //     zone: "1",
  //     status: "pending",
  //     email: "test2@gmail.com",
  //   },
  //   // ...
  // ];
  const data: User[] = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-full">
      <h3 className="text-xl font-semibold mb-2">Records</h3>

      <DataTable columns={columns} data={data} />
    </section>
  );
};

export default Residents;
