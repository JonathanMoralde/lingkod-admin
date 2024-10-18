"use client";

import React, { useEffect, useState } from "react";
import { ElectricBill, columns } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const Bill = () => {
  // const bills = await getData();
  const [bills, setBills] = useState<ElectricBill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventRef = query(
          collection(db, "bills"),
          orderBy("month", "desc")
        );
        const eventSnapshot = await getDocs(eventRef);

        const data: ElectricBill[] = eventSnapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            full_name: docData.bapa_name as string, // Omit 'id' from the User type to avoid conflicts
            total_due: docData.total_due as number,
            due_date: format(
              (docData.due_date as Timestamp).toDate(),
              "MMMM dd, yyyy"
            ),
            disconnection_date: format(
              (docData.disconnection_date as Timestamp).toDate(),
              "MMMM dd,yyyy"
            ),
            status: docData.status as string,
            uid: docData.uid as string,
          };
        });

        setBills(data);
      } catch (error) {
        console.log("An error occured while fetching data", error);
        toast.error("An error occured while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
};

export default Bill;
