import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = { params: { id: string } };

const HouseholdDetails = (props: Props) => {
  const { id }: { id: string } = props.params;
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]>HouseholdDetails">
      <div className="flex items-center  mb-10">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/residents">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold text-center w-full">
          Household details
        </h3>
      </div>
    </section>
  );
};

export default HouseholdDetails;
