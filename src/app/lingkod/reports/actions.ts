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

    let details: Report = {
      id: doc.id,
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

  return data;
}

export async function handleStatus(id: string, status: string): Promise<void> {
  const documentRef = doc(db, "blotter_reports", id);
  await updateDoc(documentRef, { status: status });

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/reports`);
}
export async function assignCaseNo(id: string, caseNo: number): Promise<void> {
  const documentRef = doc(db, "blotter_reports", id);
  await updateDoc(documentRef, { case_no: caseNo });

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/reports`);
}
