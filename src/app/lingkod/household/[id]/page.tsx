import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { columns, HouseholdMember } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";

type Props = { params: { id: string } };

const HouseholdDetails = (props: Props) => {
  const { id }: { id: string } = props.params;

  const members: HouseholdMember[] = [
    { name: "test", age: "21" },
    { name: "sheesh", age: "23" },
  ];
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <div className="flex items-center  mb-10">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/household">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold w-full">Household details</h3>
      </div>

      <div className="mb-4">
        <p>Household Head:</p>
        <p>Address:</p>
        <p>Contact Number:</p>
        <p>Number of Members:</p>
        <p>Date submitted:</p>
      </div>

      <article>
        <p className="mb-4">Members:</p>

        <DataTable columns={columns} data={members} hideSearch={true} />
      </article>
    </section>
  );
};

export default HouseholdDetails;
