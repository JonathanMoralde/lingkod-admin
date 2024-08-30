"use server";

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

export type BarangayOfficial = {
  id: string;
  full_name: string;
  position: string;
};

export async function barangayOfficial(
  position: string
): Promise<BarangayOfficial> {
  const userRef = query(
    collection(db, "users"),
    where("role", "==", "admin"),
    where("position", "==", position),
    where("status", "==", "active")
  );
  const userSnapshot = await getDocs(userRef);

  const doc = userSnapshot.docs[0];

  const docData = doc.data();

  return {
    id: doc.id,
    full_name: docData.joined_full_name, // Omit 'id' from the User type to avoid conflicts
    position: docData.position,
  };
}

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
};

export async function getDocRequestDetails(docId: string): Promise<DocDetails> {
  // Fetch data from your API here.

  const eventDoc = doc(collection(db, "requests"), docId);

  const eventDocSnap = await getDoc(eventDoc);

  if (eventDocSnap.exists()) {
    const docData = eventDocSnap.data();

    let result: DocDetails = {
      id: docId,
      full_name: docData.full_name,
      date_requested: (docData.date_requested as Timestamp).toMillis(),
      status: docData.status,
      type: docData.type,
      details: {} as
        | BrgyIndigency
        | BrgyClearance
        | EventPermit
        | BusinessPermit,
    };

    switch (docData.type) {
      case "Barangay Clearance":
        result.details = {
          age: docData.details.age,
          civil_status: docData.details.civil_status,
          gender: docData.details.gender,
          zone: docData.details.zone,
          purpose: docData.details.purpose,
        } as BrgyClearance;
        break;

      case "Barangay Indigency":
        result.details = {
          citizenship: docData.details.citizenship,
          civil_status: docData.details.civil_status,
          gender: docData.details.gender,
          purpose: docData.details.purpose,
        } as BrgyIndigency;
        break;

      case "Event Permit":
        result.details = {
          age: docData.age,
          citizenship: docData.details.citizenship,
          civil_status: docData.details.civil_status,
          gender: docData.details.gender,
          event_date: (docData.details.event_date as Timestamp).toMillis(),
          event_name: docData.details.event_name,
          event_place: docData.details.event_place,
          event_time: docData.details.event_time,
          guest_no: docData.details.guest_no,
        } as EventPermit;
        break;

      case "Business Permit":
        result.details = {
          address: docData.details.address,
          amount_paid: docData.details.amount_paid,
          business_location: docData.details.business_location,
          nature_of_business: docData.details.nature_of_business,
          permit_no: docData.details.permit_no,
          proprietor: docData.details.proprietor,
          status: docData.details.status,
          valid_until: (docData.details.valid_until as Timestamp).toMillis(),
        } as BusinessPermit;
        break;

      default:
        throw new Error("Unknown document type");
    }
    // Assuming your docData has the correct type annotations
    return result;
  } else {
    throw new Error("Document not found");
  }
}

// ! BLOTTER REPORT

// export type BlotterDocDetails = {
//   id: string;
//   full_name: string;
//   type: string;
//   date_requested: number;
//   status: "pending" | "accepted" | "declined";
//   details: BrgyIndigency | BrgyClearance | EventPermit | BusinessPermit;
// };
