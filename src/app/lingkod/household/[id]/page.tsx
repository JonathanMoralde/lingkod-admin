"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { HouseholdDetail, HouseholdMember } from "../columns";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { collection, doc, Timestamp, getDoc } from "firebase/firestore";

type Props = { params: { id: string } };

const HouseholdDetails = (props: Props) => {
  const { id }: { id: string } = props.params;

  const [householdData, setHouseholdData] = useState<HouseholdDetail>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const householdDoc = doc(collection(db, "household_registrations"), id);

        const householdDocSnap = await getDoc(householdDoc);

        if (householdDocSnap.exists()) {
          const docData = householdDocSnap.data();

          // Assuming your docData has the correct type annotations
          setHouseholdData({
            id: id,
            uid: docData.user_uid,
            household_head: docData.household_head,
            contact_no: docData.contact_number,
            member_no: docData.number_of_members,
            address: docData.address,
            date_submitted: format(
              (docData.timestamp as Timestamp).toDate(),
              "MMMM dd, yyyy"
            ),
            members: docData.members as HouseholdMember[],
          });
        }
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
    <ScrollArea className="bg-indigo-950 rounded-xl px-4   min-h-[80vh]">
      {loading ? (
        <div className="w-full h-[80vh] grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <section className="py-10">
          <div className="flex items-center  mb-10">
            <Button variant="ghost" size="icon" className=" justify-start">
              <Link href="/lingkod/household">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-lg md:text-xl font-semibold w-full">
              Household details
            </h3>
          </div>

          <article className="mb-4 flex gap-4 text-sm md:text-base">
            <div className="text-gray-100">
              <h3>Household Head: </h3>
              <h3>Address: </h3>
              <h3>Contact Number: </h3>
              <h3>Number of Members: </h3>
              <h3>Date submitted: </h3>
            </div>

            <div className="text-gray-300 ">
              <h3>{householdData?.household_head ?? ""}</h3>
              <h3>{householdData?.address ?? ""}</h3>
              <h3>{householdData?.contact_no ?? ""}</h3>
              <h3>{householdData?.member_no ?? ""}</h3>
              <h3>{householdData?.date_submitted ?? ""}</h3>
            </div>
          </article>

          <article>
            <p className="mb-4 text-sm md:text-base">Members:</p>

            <DataTable
              columns={columns}
              data={householdData?.members ?? []}
              hideSearch={true}
            />
          </article>
        </section>
      )}
    </ScrollArea>
  );
};

export default HouseholdDetails;
