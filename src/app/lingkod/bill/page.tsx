import React from "react";
import { ElectricBill, columns } from "./columns";
import { Timestamp } from "firebase/firestore";
import { DataTable } from "@/components/lingkod/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getData } from "./action";

export const dynamic = "force-dynamic";

const Bill = async () => {
  const bills = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <div className="mb-6 flex justify-between">
        <h3 className="text-xl font-semibold ">Electric Bill</h3>

        <Link href="/lingkod/bill/new">
          <Button
            variant="default"
            className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 "
          >
            Post Bill
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={bills} />
    </section>
  );
};

export default Bill;
