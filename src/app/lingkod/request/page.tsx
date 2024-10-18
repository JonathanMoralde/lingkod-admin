"use client";

import { DataTable } from "@/components/lingkod/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { columns, DocRequest } from "./columns";

const Request = () => {
  const [requests, setRequests] = useState<DocRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRef = query(collection(db, "requests"));
        const userSnapshot = await getDocs(userRef);

        const data: DocRequest[] = userSnapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            uid: docData.uid,
            full_name: docData.full_name,
            date_requested: format(
              (docData.date_requested as Timestamp).toDate(),
              "MMMM dd, yyyy"
            ),
            status: docData.status,
            type: docData.type,
          };
        });

        setRequests(data);
      } catch (error) {
        console.log("An error occured while fetching document requests", error);
        toast.error("An error occured while fetching document requests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const changeStatus = (
    status: "pending" | "approved" | "rejected",
    data: DocRequest
  ) => {
    const index = requests.findIndex((e) => e.id == data.id);
    let tempData = requests;
    tempData[index].status = status;
    setRequests([...tempData]);
  };

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">Document Requests</h3>

          <DataTable columns={columns} data={requests} />
        </>
      )}
    </section>
  );
};

export default Request;
