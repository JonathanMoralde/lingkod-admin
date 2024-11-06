"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { collection, doc, Timestamp, getDoc } from "firebase/firestore";

type Props = { params: { id: string } };

export type BillDetail = {
  id: string;
  uid: string;
  bapa_name: string;
  meter_no: number;
  present_reading: number;
  previous_reading: number;
  total_due: number;
  date_released: number;
  due_date: number;
  disconnection_date: number;
  month_year: number;
};

const BillDetails = (props: Props) => {
  const [billDetail, setBillDetail] = useState<BillDetail>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const billDoc = doc(collection(db, "bills"), props.params.id);

        const billDocSnap = await getDoc(billDoc);

        if (billDocSnap.exists()) {
          const docData = billDocSnap.data();

          // Assuming your docData has the correct type annotations
          setBillDetail({
            id: props.params.id,
            uid: docData.uid,
            bapa_name: docData.bapa_name,
            date_released: (docData.date_released as Timestamp).toMillis(),
            disconnection_date: (
              docData.disconnection_date as Timestamp
            ).toMillis(),
            due_date: (docData.due_date as Timestamp).toMillis(),
            meter_no: docData.meter_no,
            present_reading: docData.present_reading,
            previous_reading: docData.previous_reading,
            total_due: docData.total_due,
            month_year: (docData.month as Timestamp).toMillis(),
          });
        }
      } catch (error) {
        console.log("An error occured while fetching bill details", error);
        toast.error("An error occured while fetching bill details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      {loading && billDetail === undefined ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center  mb-6">
            <Button variant="ghost" size="icon" className=" justify-start">
              <Link href="/lingkod/bill">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-lg md:text-xl font-semibold w-full">
              BAPA Consumption Bill
            </h3>
          </div>
          <div className="md:w-1/2 text-gray-50 text-sm md:text-base">
            <article className="mb-4 flex gap-4">
              <div>
                <h3>BAPA Member Name:</h3>
                <h3>Meter no.:</h3>
                <h3>Month/Year:</h3>
              </div>
              <div className=" text-gray-300">
                <h3>{billDetail?.bapa_name ?? ""}</h3>
                <h3>{billDetail?.meter_no ?? ""}</h3>
                <h3>
                  {billDetail?.month_year
                    ? format(new Date(billDetail.month_year), "MMMM yyyy")
                    : ""}
                </h3>
              </div>
            </article>
            <div className="grid grid-cols-3">
              <h3>Billed</h3>
              <h3>Present</h3>
              <h3>Previous</h3>
            </div>
            <div className="grid grid-cols-3">
              <h3>MTR RDG:</h3>
              <h3 className="text-gray-300">
                {billDetail?.present_reading ?? ""}
              </h3>
              <h3 className="text-gray-300">
                {billDetail?.previous_reading ?? ""}
              </h3>
            </div>

            <h3 className="my-8 flex gap-4">
              <span>Total Amount:</span>
              <span className=" text-gray-300">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  minimumFractionDigits: 0,
                }).format(billDetail?.total_due ?? 0)}
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
                  {billDetail?.date_released
                    ? format(
                        new Date(billDetail.date_released),
                        "MMMM dd, yyyy"
                      )
                    : ""}
                </h3>
                <h3>
                  {billDetail?.due_date
                    ? format(new Date(billDetail.due_date), "MMMM dd, yyyy")
                    : ""}
                </h3>
                <h3>
                  {billDetail?.disconnection_date
                    ? format(
                        new Date(billDetail.disconnection_date),
                        "MMMM dd, yyyy"
                      )
                    : ""}
                </h3>
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
};

export default BillDetails;
