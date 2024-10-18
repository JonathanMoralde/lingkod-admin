"use client";

import React, { useEffect, useState } from "react";
import { columns, Report } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { toast } from "sonner";
// import { getData } from "./actions";
import { db } from "@/config/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { Loader2 } from "lucide-react";

// export const dynamic = "force-dynamic";

const Reports = () => {
  // const reports: Report[] = await getData();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRef = query(collection(db, "blotter_reports"));
        const userSnapshot = await getDocs(userRef);

        const data: Report[] = userSnapshot.docs.map((doc) => {
          const docData = doc.data();

          let details: Report = {
            id: doc.id,
            uid: docData.uid,
            complainant: docData.complainant,
            date_reported: docData.reported_date,
            time_reported: docData.reported_time,
            what: docData.what,
            status: docData.status,
          };

          if (docData.case_no != null) {
            details.case_no = docData.case_no;
          }

          return details;
        });
        setReports(data);
      } catch (error) {
        console.log("An error occured while fetching reports", error);
        toast.error("An error occured while fetching reports");
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
          <h3 className="text-xl font-semibold mb-2">Blotter Reports</h3>

          <DataTable columns={columns} data={reports} />
        </>
      )}
    </section>
  );
};

export default Reports;
