import React from "react";
import { ElectricBill, columns } from "./columns";
import { Timestamp } from "firebase/firestore";
import { DataTable } from "@/components/lingkod/data-table";

const Bill = () => {
  const bills: ElectricBill[] = [
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH3",
      full_name: "Test Y Sheesh",
      total_amount: 15000,
      due_date: Timestamp.now().toMillis(),
      disconnection_date: Timestamp.now().toMillis(),
    },
  ];

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-full">
      <h3 className="text-xl font-semibold mb-2">Electric Bill</h3>

      <DataTable columns={columns} data={bills} />
    </section>
  );
};

export default Bill;
