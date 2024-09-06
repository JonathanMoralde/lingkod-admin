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

import { DocRequest } from "./columns";
import { format } from "date-fns";

export async function getData(): Promise<DocRequest[]> {
  // Fetch data from your API here.

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

  return data;
}

export async function handleApprove(
  id: string,
  uid: string,
  type: string
): Promise<void> {
  const documentRef = doc(db, "requests", id);
  await updateDoc(documentRef, { status: "approved" });

  const notificationRef = collection(db, "notifications");
  const notificationData: any = {
    receiver_uid: uid,
    notif_msg: `Your request for ${type} has been approved and is ready to be claimed at the Barangay Hall.`,
    type: "request",
    timestamp: serverTimestamp(),
  };

  await addDoc(notificationRef, notificationData);

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/request`);
}

export async function handleReject(
  id: string,
  uid: string,
  type: string
): Promise<void> {
  const documentRef = doc(db, "requests", id);
  await updateDoc(documentRef, { status: "rejected" });

  const notificationRef = collection(db, "notifications");
  const notificationData: any = {
    receiver_uid: uid,
    notif_msg: `Your request for ${type} has been rejected`,
    type: "request",
    timestamp: serverTimestamp(),
  };

  await addDoc(notificationRef, notificationData);

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/request`);
}

export async function assignCTCNo(
  id: string,
  ctcNo: string,
  issuedAt: string,
  issuedOn: number
): Promise<void> {
  const documentRef = doc(db, "requests", id);
  await updateDoc(documentRef, {
    "details.ctc_no": ctcNo,
    "details.ctc_issued_at": issuedAt,
    "details.ctc_issued_on": Timestamp.fromMillis(issuedOn),
  });

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/request`);
}

export async function assignORNo(
  id: string,
  orNo: string,
  issuedOn: number
): Promise<void> {
  const documentRef = doc(db, "requests", id);
  await updateDoc(documentRef, {
    "details.or_no": orNo,
    "details.or_issued_on": Timestamp.fromMillis(issuedOn),
  });

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/request`);
}
