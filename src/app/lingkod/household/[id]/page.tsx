import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { columns, HouseholdMember } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { HouseholdDetail } from "../columns";
import { getHouseholdData } from "../actions";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = { params: { id: string } };

const HouseholdDetails = async (props: Props) => {
  const { id }: { id: string } = props.params;

  const householdData: HouseholdDetail = await getHouseholdData(id);
  const members: HouseholdMember[] = householdData.members ?? [];
  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4   h-[80vh]">
      <section className="py-10">
        <div className="flex items-center  mb-10">
          <Button variant="ghost" size="icon" className=" justify-start">
            <Link href="/lingkod/household">
              <ArrowLeft />
            </Link>
          </Button>

          <h3 className="text-xl font-semibold w-full">Household details</h3>
        </div>

        <article className="mb-4 flex gap-4">
          <div className="text-gray-100">
            <h3>Household Head: </h3>
            <h3>Address: </h3>
            <h3>Contact Number: </h3>
            <h3>Number of Members: </h3>
            <h3>Date submitted: </h3>
          </div>

          <div className="text-gray-300 ">
            <h3>{householdData.household_head}</h3>
            <h3>{householdData.address}</h3>
            <h3>{householdData.contact_no}</h3>
            <h3>{householdData.member_no}</h3>
            <h3>{householdData.date_submitted}</h3>
          </div>
        </article>

        <article>
          <p className="mb-4">Members:</p>

          <DataTable columns={columns} data={members} hideSearch={true} />
        </article>
      </section>
    </ScrollArea>
  );
};

export default HouseholdDetails;
