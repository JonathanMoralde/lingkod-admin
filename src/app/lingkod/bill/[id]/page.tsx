import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BillDetail, getBillData } from "../action";
import { format } from "date-fns";

type Props = { params: { id: string } };

const BillDetails = async (props: Props) => {
  const billDetail: BillDetail = await getBillData(props.params.id);

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <div className="flex items-center  mb-6">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/bill">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold w-full">BAPA Consumption Bill</h3>
      </div>
      <div className="w-1/2 text-gray-50">
        <article className="mb-4 flex gap-4">
          <div>
            <h3>BAPA Member Name:</h3>
            <h3>Meter no.:</h3>
            <h3>Month/Year:</h3>
          </div>
          <div className=" text-gray-300">
            <h3>{billDetail.bapa_name}</h3>
            <h3>{billDetail.meter_no}</h3>
            <h3>{format(new Date(billDetail.month_year), "MMMM yyyy")}</h3>
          </div>
        </article>
        <div className="grid grid-cols-3">
          <h3>Billed</h3>
          <h3>Present</h3>
          <h3>Previous</h3>
        </div>
        <div className="grid grid-cols-3">
          <h3>MTR RDG:</h3>
          <h3 className="text-gray-300">{billDetail.present_reading}</h3>
          <h3 className="text-gray-300">{billDetail.previous_reading}</h3>
        </div>

        <h3 className="my-8 flex gap-4">
          <span>Total Amount:</span>
          <span className=" text-gray-300">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
            }).format(billDetail.total_due)}
          </span>
        </h3>

        <article className="flex gap-4">
          <div>
            <h3>Date Released: </h3>
            <h3>Due Date:</h3>
            <h3>Disconnection Date:</h3>
          </div>
          <div className=" text-gray-300">
            <h3>
              {format(new Date(billDetail.date_released), "MMMM dd, yyyy")}
            </h3>
            <h3>{format(new Date(billDetail.due_date), "MMMM dd, yyyy")}</h3>
            <h3>
              {format(new Date(billDetail.disconnection_date), "MMMM dd, yyyy")}
            </h3>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BillDetails;
