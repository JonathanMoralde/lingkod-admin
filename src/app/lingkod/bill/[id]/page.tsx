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
      <div className="w-3/4">
        <div className="mb-4">
          <h3>
            BAPA Member Name:
            <span className="ms-4 font-light">{billDetail.bapa_name}</span>
          </h3>
          <h3>
            Meter no.:
            <span className="ms-4 font-light">{billDetail.meter_no}</span>
          </h3>
          <h3>
            Month/Year:
            <span className="ms-4 font-light">
              {format(new Date(billDetail.month_year), "MMMM yyyy")}
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-3">
          <h3>Billed</h3>
          <h3>Present</h3>
          <h3>Previous</h3>
        </div>
        <div className="grid grid-cols-3">
          <h3>MTR RDG:</h3>
          <h3 className="font-light">{billDetail.present_reading}</h3>
          <h3 className="font-light">{billDetail.previous_reading}</h3>
        </div>

        <h3 className="my-8">
          Total Amount:{" "}
          <span className="ms-4 font-light">
            {new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
            }).format(billDetail.total_due)}
          </span>
        </h3>

        <div>
          <h3>
            Date Released:{" "}
            <span className="ms-4 font-light">
              {format(new Date(billDetail.date_released), "MMMM dd, yyyy")}
            </span>
          </h3>
          <h3>
            Due Date:
            <span className="ms-4 font-light">
              {format(new Date(billDetail.due_date), "MMMM dd, yyyy")}
            </span>
          </h3>
          <h3>
            Disconnection Date:{" "}
            <span className="ms-4 font-light">
              {format(new Date(billDetail.disconnection_date), "MMMM dd, yyyy")}
            </span>
          </h3>
        </div>
      </div>
    </section>
  );
};

export default BillDetails;
