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
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";

import { Report } from "./columns";
import { string } from "zod";

export async function getData(): Promise<Report[]> {
  // Fetch data from your API here.

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

  return data;
}

export async function handleStatus(
  id: string,
  status: string,
  uid: string
): Promise<void> {
  const documentRef = doc(db, "blotter_reports", id);
  await updateDoc(documentRef, { status: status });

  const notificationRef = collection(db, "notifications");
  const notificationData: any = {
    is_read: false,
    receiver_uid: uid,
    notif_msg: `Blotter report status is now ${status}.`,
    type: "report",
    timestamp: serverTimestamp(),
  };

  await addDoc(notificationRef, notificationData);

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/reports`);
}
export async function assignCaseNo(
  id: string,
  caseNo: number,
  uid: string
): Promise<void> {
  const documentRef = doc(db, "blotter_reports", id);
  await updateDoc(documentRef, { case_no: caseNo });

  const notificationRef = collection(db, "notifications");
  const notificationData: any = {
    is_read: false,
    receiver_uid: uid,
    notif_msg: `Blotter report have been assigned with a case number: ${caseNo}.`,
    type: "report",
    timestamp: serverTimestamp(),
  };

  await addDoc(notificationRef, notificationData);

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/reports`);
}
