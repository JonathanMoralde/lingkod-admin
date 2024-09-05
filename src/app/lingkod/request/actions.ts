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

import { DocRequest } from "./columns";

export async function getData(): Promise<DocRequest[]> {
  // Fetch data from your API here.

  const userRef = query(collection(db, "requests"));
  const userSnapshot = await getDocs(userRef);

  const data: DocRequest[] = userSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      full_name: docData.full_name,
      date_requested: (docData.date_requested as Timestamp).toMillis(),
      status: docData.status,
      type: docData.type,
    };
  });

  return data;
}

export async function handleApprove(id: string): Promise<void> {
  const documentRef = doc(db, "requests", id);
  await updateDoc(documentRef, { status: "approved" });

  // Trigger revalidation for the specific path
  revalidatePath(`/lingkod/request`);
}
export async function handleReject(id: string): Promise<void> {
  const documentRef = doc(db, "requests", id);
  await updateDoc(documentRef, { status: "rejected" });

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
