"use server";

import { User } from "./columns";
import { db } from "@/config/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getData(): Promise<User[]> {
  // Fetch data from your API here.

  const userRef = query(collection(db, "users"), where("role", "==", "user"));
  const userSnapshot = await getDocs(userRef);

  const data: User[] = userSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      full_name: docData.joined_full_name, // Omit 'id' from the User type to avoid conflicts
      zone: docData.zone,
      email: docData.email,
      status: docData.status,
    };
  });

  return data;
}

export async function handleApprove(id: string) {
  try {
    const documentRef = doc(db, "users", id);
    await updateDoc(documentRef, { status: "approved" });

    // Trigger revalidation for the specific path
    revalidatePath("/lingkod/residents");

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Error updating status" };
  }
}
