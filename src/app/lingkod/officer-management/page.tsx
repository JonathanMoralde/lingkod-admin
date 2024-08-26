import React from "react";
import { Admin, columns } from "./columns";
import { DataTable } from "../../../components/lingkod/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getData } from "./actions";

type Props = {};

const OfficerManagement = async (props: Props) => {
  const data: Admin[] = await getData();
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      <div className="mb-2 flex justify-between">
        <h3 className="text-xl font-semibold ">Officer Management</h3>

        <Link href="/lingkod/officer-management/new">
          <Button
            variant="default"
            className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 "
          >
            New Officer
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </section>
  );
};

export default OfficerManagement;
