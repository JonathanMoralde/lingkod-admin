"use client";

import React, { useCallback, useEffect, useState } from "react";
// import { DocDetails, getDocRequestDetails } from "../actions";
import PdfView from "./pdf-viewer";
// import { BarangayOfficial } from "../actions";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
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
  // const docDetails: DocDetails = await getDocRequestDetails(props.params.id);
  // const barangayCaptain: BarangayOfficial = await barangayOfficial("Captain");
  // const barangaySecretary: BarangayOfficial = await barangayOfficial(
  //   "Secretary"
  // );

  const [docDetails, setDocDetails] = useState<DocDetails>();
  const [barangayCaptain, setBarangayCaptain] = useState<BarangayOfficial>();
  const [barangaySecretary, setBarangaySecretary] =
    useState<BarangayOfficial>();
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       const eventDoc = doc(collection(db, "requests"), id);

  //       const eventDocSnap = await getDoc(eventDoc);

  //       if (eventDocSnap.exists()) {
  //         const docData = eventDocSnap.data();

  //         let result: DocDetails = {
  //           id,
  //           full_name: docData.full_name,
  //           date_requested: (docData.date_requested as Timestamp).toMillis(),
  //           status: docData.status,
  //           type: docData.type,
  //           details: {} as
  //             | BrgyIndigency
  //             | BrgyClearance
  //             | EventPermit
  //             | BusinessPermit,
  //         };

  //         switch (docData.type) {
  //           case "Barangay Clearance":
  //             result.details = {
  //               age: docData.details.age,
  //               civil_status: docData.details.civil_status,
  //               gender: docData.details.gender,
  //               zone: docData.details.zone,
  //               purpose: docData.details.purpose,
  //             } as BrgyClearance;

  //             if (
  //               docData.details.ctc_no &&
  //               docData.details.ctc_issued_at &&
  //               docData.details.ctc_issued_on
  //             ) {
  //               result.details.ctc_no = docData.details.ctc_no;
  //               result.details.ctc_issued_at = docData.details.ctc_issued_at;
  //               result.details.ctc_issued_on = (
  //                 docData.details.ctc_issued_on as Timestamp
  //               ).toMillis();
  //             }
  //             break;

  //           case "Barangay Indigency":
  //             result.details = {
  //               citizenship: docData.details.citizenship,
  //               civil_status: docData.details.civil_status,
  //               gender: docData.details.gender,
  //               purpose: docData.details.purpose,
  //             } as BrgyIndigency;
  //             break;

  //           case "Event Permit":
  //             result.details = {
  //               age: docData.age,
  //               citizenship: docData.details.citizenship,
  //               civil_status: docData.details.civil_status,
  //               gender: docData.details.gender,
  //               event_date: (
  //                 docData.details.event_date as Timestamp
  //               ).toMillis(),
  //               event_name: docData.details.event_name,
  //               event_place: docData.details.event_place,
  //               event_time: docData.details.event_time,
  //               guest_no: docData.details.guest_no,
  //             } as EventPermit;
  //             break;

  //           case "Business Permit":
  //             result.details = {
  //               address: docData.details.address,
  //               amount_paid: docData.details.amount_paid,
  //               business_location: docData.details.business_location,
  //               nature_of_business: docData.details.nature_of_business,
  //               permit_no: docData.details.permit_no,
  //               proprietor: docData.details.proprietor,
  //               status: docData.details.status,
  //               valid_until: (
  //                 docData.details.valid_until as Timestamp
  //               ).toMillis(),
  //             } as BusinessPermit;

  //             if (
  //               docData.details.ctc_no &&
  //               docData.details.ctc_issued_at &&
  //               docData.details.ctc_issued_on
  //             ) {
  //               result.details.ctc_no = docData.details.ctc_no;
  //               result.details.ctc_issued_at = docData.details.ctc_issued_at;
  //               result.details.ctc_issued_on = (
  //                 docData.details.ctc_issued_on as Timestamp
  //               ).toMillis();
  //             }

  //             if (docData.details.or_no && docData.details.or_issued_on) {
  //               result.details.or_no = docData.details.ctc_no;
  //               result.details.or_issued_on = (
  //                 docData.details.ctc_issued_on as Timestamp
  //               ).toMillis();
  //             }
  //             break;

  //           default:
  //             throw new Error("Unknown document type");
  //         }

  //         setDocDetails(result);

  //         const userRef = query(
  //           collection(db, "users"),
  //           where("role", "==", "admin"),
  //           where("position", "==", "Captain"),
  //           where("status", "==", "active")
  //         );
  //         const userSnapshot = await getDocs(userRef);

  //         const doc = userSnapshot.docs[0];

  //         const captainDocData = doc.data();

  //         setBarangayCaptain({
  //           id: doc.id,
  //           full_name: captainDocData.joined_full_name,
  //           position: captainDocData.position,
  //         });

  //         const secretaryUserRef = query(
  //           collection(db, "users"),
  //           where("role", "==", "admin"),
  //           where("position", "==", "Captain"),
  //           where("status", "==", "active")
  //         );
  //         const secretaryUserSnapshot = await getDocs(secretaryUserRef);

  //         const secretaryDoc = secretaryUserSnapshot.docs[0];

  //         const secretaryDocData = secretaryDoc.data();

  //         setBarangaySecretary({
  //           id: secretaryDoc.id,
  //           full_name: secretaryDocData.joined_full_name,
  //           position: secretaryDocData.position,
  //         });
  //       }
  //     } catch (error) {
  //       console.log("An error occured while fetching PDF details", error);
  //       toast.error("An error occured while fetching PDF details");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);
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
