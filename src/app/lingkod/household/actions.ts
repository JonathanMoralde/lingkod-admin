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
import { HouseholdDetail, HouseholdMember } from "./columns";
import { format } from "date-fns";

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
      date_submitted: format(
        (docData.timestamp as Timestamp).toDate(),
        "MMMM dd, yyyy"
      ),
    };
  });

  return data;
}

export async function getHouseholdData(id: string): Promise<HouseholdDetail> {
  // Fetch data from your API here.

  const householdDoc = doc(collection(db, "household_registrations"), id);

  const householdDocSnap = await getDoc(householdDoc);

  if (householdDocSnap.exists()) {
    const docData = householdDocSnap.data();

    // Assuming your docData has the correct type annotations
    return {
      id: id,
      uid: docData.user_uid,
      household_head: docData.household_head,
      contact_no: docData.contact_number,
      member_no: docData.number_of_members,
      address: docData.address,
      date_submitted: format(
        (docData.timestamp as Timestamp).toDate(),
        "MMMM dd, yyyy"
      ),
      members: docData.members as HouseholdMember[],
    };
  } else {
    throw new Error("Document not found");
  }
}
