"use client";

import React, { useCallback, useEffect, useState } from "react";
import PdfView from "./pdf-viewer";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { collection, doc, Timestamp, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { BarangayOfficial, fetchBarangayOfficial } from "@/utils/firebaseUtils";

export type DocDetails = {
  id: string;
  full_name: string;
  type: string;
  date_requested: number;
  status: "pending" | "accepted" | "declined";
  details: BrgyIndigency | BrgyClearance | EventPermit | BusinessPermit;
};

export type BrgyIndigency = {
  citizenship: string;
  civil_status: string;
  gender: string;
  purpose: String;
};
export type BrgyClearance = {
  age: number;
  civil_status: string;
  gender: string;
  zone: string;
  purpose: String;
  ctc_no?: string;
  ctc_issued_at?: string;
  ctc_issued_on?: number;
};
export type EventPermit = {
  age: number;
  citizenship: string;
  civil_status: string;
  gender: string;
  event_date: number;
  event_name: string;
  event_place: string;
  event_time: string;
  guest_no: number;
};
export type BusinessPermit = {
  address: string;
  amount_paid: number;
  business_location: string;
  nature_of_business: string;
  permit_no: string;
  proprietor: string;
  status: string;
  valid_until: number;
  ctc_no?: string;
  ctc_issued_at?: string;
  ctc_issued_on?: number;
  or_no?: string;
  or_issued_on?: number;
};

type Props = { params: { id: string } };

const PdfPreview = ({ params }: Props) => {
  const { id } = params;

  const [docDetails, setDocDetails] = useState<DocDetails>();
  const [barangayCaptain, setBarangayCaptain] = useState<BarangayOfficial>();
  const [barangaySecretary, setBarangaySecretary] =
    useState<BarangayOfficial>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const docDetails = await fetchDocDetails(id);
        const [captain, secretary] = await Promise.all([
          fetchBarangayOfficial("Captain"),
          fetchBarangayOfficial("Secretary"),
        ]);

        setDocDetails(docDetails);
        setBarangayCaptain(captain);
        setBarangaySecretary(secretary);
      } catch (error) {
        console.error("Error fetching PDF details", error);
        toast.error("An error occurred while fetching PDF details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchDocDetails = useCallback(async (docId: string) => {
    const docRef = doc(collection(db, "requests"), docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docId,
        full_name: data.full_name,
        date_requested: (data.date_requested as Timestamp).toMillis(),
        status: data.status,
        type: data.type,
        details: mapDocDetails(data),
      } as DocDetails;
    }
    throw new Error("Document not found");
  }, []);

  const mapDocDetails = (data: any) => {
    switch (data.type) {
      case "Barangay Clearance":
        return {
          ...data.details,
          ctc_issued_on: data.details.ctc_issued_on?.toMillis(),
        } as BrgyClearance;
      case "Barangay Indigency":
        return { ...data.details } as BrgyIndigency;
      case "Event Permit":
        return {
          ...data.details,
          event_date: data.details.event_date?.toMillis(),
        } as EventPermit;
      case "Business Permit":
        return {
          ...data.details,
          valid_until: data.details.valid_until?.toMillis(),
          ctc_issued_on: data.details.ctc_issued_on?.toMillis(),
          or_issued_on: data.details.or_issued_on?.toMillis(),
        } as BusinessPermit;
      default:
        throw new Error("Unknown document type");
    }
  };

  return (
    <main className="h-screen w-full">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          {docDetails && barangayCaptain && barangaySecretary ? (
            <PdfView
              data={docDetails}
              barangayCaptain={barangayCaptain}
              barangaySecretary={barangaySecretary}
            />
          ) : (
            ""
          )}
        </>
      )}
    </main>
  );
};

export default PdfPreview;
