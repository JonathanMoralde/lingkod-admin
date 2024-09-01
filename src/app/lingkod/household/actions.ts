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
import { HouseholdDetail } from "./columns";

export async function getData(): Promise<HouseholdDetail[]> {
  // Fetch data from your API here.

  const userRef = query(collection(db, "household_registrations"));
  const userSnapshot = await getDocs(userRef);

  const data: HouseholdDetail[] = userSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      household_head: docData.household_head,
      address: docData.address,
      member_no: docData.number_of_members,
      contact_no: docData.contact_number,
      date_submitted: (docData.timestamp as Timestamp).toMillis(),
    };
  });

  return data;
}
