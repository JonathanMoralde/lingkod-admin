"use client";

import React, { useEffect, useState } from "react";
import { columns, HouseholdDetail } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { db } from "@/config/firebase";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Household = () => {
  const [data, setData] = useState<HouseholdDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRef = query(collection(db, "household_registrations"));
        const userSnapshot = await getDocs(userRef);

        const households: HouseholdDetail[] = userSnapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            household_head: docData.household_head,
            address: docData.address,
            member_no: docData.number_of_members,
            contact_no: docData.contact_number,
            date_submitted: format(
              (docData.timestamp as Timestamp).toDate(),
              "MMMM dd, yyyy"
            ),
          };
        });

        setData(households);
      } catch (error) {
        console.log("An error occured while fetching household data", error);
        toast.error("An error occured while fetching household data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      {loading ? (
        <div className="w-full h-[80vh] grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">Household</h3>

          <DataTable columns={columns} data={data} />
        </>
      )}
    </section>
  );
};

export default Household;
