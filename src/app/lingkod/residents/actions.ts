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
  Timestamp,
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
    revalidatePath(`/lingkod/residents/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Error updating status" };
  }
}

export async function handleReject(id: string) {
  try {
    const documentRef = doc(db, "users", id);
    await updateDoc(documentRef, { status: "rejected" });

    // Trigger revalidation for the specific path
    revalidatePath(`/lingkod/residents/${id}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Error updating status" };
  }
}

export interface UserDetails {
  id: string;
  full_name: string;
  zone: string;
  email: string;
  status: "pending" | "approved" | "not approved";
  age: number;
  birthday: number;
  block: string;
  civil_status: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  contact_number: string;
  lot: string;
  profile_pic: string;
  sector: string;
  valid_id: string;
}

export async function getUserData(uid: string): Promise<UserDetails> {
  // Fetch data from your API here.

  const userRef = query(collection(db, "users"), where("uid", "==", uid));
  const userSnapshot = await getDocs(userRef);

  const doc = userSnapshot.docs[0];

  const docData = doc.data();

  return {
    id: doc.id,
    full_name: docData.joined_full_name, // Omit 'id' from the User type to avoid conflicts
    zone: docData.zone,
    email: docData.email,
    status: docData.status,
    age: docData.age,
    birthday: (docData.birthday as Timestamp).toMillis(),
    block: docData.block,
    civil_status: docData.civil_status,
    contact_number: docData.contact_number,
    first_name: docData.first_name,
    middle_name: docData.middle_name,
    last_name: docData.last_name,
    lot: docData.lot,
    gender: docData.gender,
    profile_pic: docData.profile_pic,
    sector: docData.sector,
    valid_id: docData.valid_id,
  };
}

export async function handleEdit(
  id: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  zone: string,
  email: string,
  age: number,
  birthday: Date,
  block: string,
  lot: string,
  sector: string,
  civil_status: string,
  gender: string,
  contact_number: string
) {
  try {
    const documentRef = doc(collection(db, "users"), id);

    const eventData: any = {
      first_name,
      middle_name,
      last_name,
      joined_full_name: `${first_name} ${middle_name} ${last_name}`,
      joined_full_name_lowercase: `${first_name.toLocaleLowerCase()} ${middle_name.toLocaleLowerCase()} ${last_name.toLocaleLowerCase()}`,
      zone,
      email,
      age,
      birthday,
      block,
      lot,
      sector,
      civil_status,
      gender,
      contact_number,
    };

    await updateDoc(documentRef, eventData);

    revalidatePath("/lingkod/residents");

    return { success: true };
  } catch (error) {
    console.error("Error posting event:", error);
    return { success: false, error: "Error posting event" };
  }
}
