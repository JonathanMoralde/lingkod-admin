"use client";

import React, { useCallback, useEffect, useState } from "react";
import BlotterPdfView from "./pdf-viewer";
import { BarangayOfficial, fetchBarangayOfficial } from "@/utils/firebaseUtils";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export type BlotterDocDetails = {
  id: string;
  case_no?: number;
  complainant: string;
  date_reported: string;
  time_reported: string;
  what: string;
  when: string;
  where: string;
  why: string;
  how: string;
  status: string;
};

type Props = { params: { id: string } };

const BlotterPdfPreview = ({ params }: Props) => {
  const { id } = params;
  const [blotterDetails, setBlotterDetails] = useState<BlotterDocDetails>();
  const [barangayCaptain, setBarangayCaptain] = useState<BarangayOfficial>();
  const [barangaySecretary, setBarangaySecretary] =
    useState<BarangayOfficial>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await fetchBlotterDetails(id);
        const [captain, secretary] = await Promise.all([
          fetchBarangayOfficial("Captain"),
          fetchBarangayOfficial("Secretary"),
        ]);

        setBlotterDetails(result);
        setBarangayCaptain(captain);
        setBarangaySecretary(secretary);
      } catch (error) {
        console.log("An error occured while fetching pdf details", error);
        toast.error("An error occured while fetching pdf details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchBlotterDetails = useCallback(async (docId: string) => {
    const eventDoc = doc(collection(db, "blotter_reports"), docId);

    const eventDocSnap = await getDoc(eventDoc);

    if (eventDocSnap.exists()) {
      const docData = eventDocSnap.data();

      let result: BlotterDocDetails = {
        id: docId,
        complainant: docData.complainant,
        date_reported: docData.reported_date,
        time_reported: docData.reported_time,
        what: docData.what,
        when: docData.when,
        where: docData.where,
        why: docData.why,
        how: docData.how,
        status: docData.status,
      };

      if (docData.case_no != null) {
        result.case_no = docData.case_no;
      }
      return result;
    }
  }, []);

  return (
    <main className="h-screen w-full">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          {blotterDetails && barangayCaptain && barangaySecretary ? (
            <BlotterPdfView
              barangayCaptain={barangayCaptain}
              barangaySecretary={barangaySecretary}
              data={blotterDetails}
            />
          ) : (
            ""
          )}
        </>
      )}
    </main>
  );
};

export default BlotterPdfPreview;
