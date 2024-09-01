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
import { revalidatePath } from "next/cache";

import { Report } from "./columns";

export async function getData(): Promise<Report[]> {
  // Fetch data from your API here.

  const userRef = query(collection(db, "blotter_reports"));
  const userSnapshot = await getDocs(userRef);

  const data: Report[] = userSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      complainant: docData.complainant,
      date_reported: docData.reported_date,
      time_reported: docData.reported_time,
      what: docData.what,
      status: docData.status,
    };
  });

  return data;
}
