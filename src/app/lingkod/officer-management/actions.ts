"use server";

import { db, storage, auth } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
  Timestamp,
  addDoc,
  orderBy,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { revalidatePath } from "next/cache";
import { Admin } from "./columns";

export async function getData(): Promise<Admin[]> {
  // Fetch data from your API here.

  const userRef = query(
    collection(db, "users"),
    where("role", "==", "admin"),
    where("status", "==", "active"),
    orderBy("position")
  );
  const userSnapshot = await getDocs(userRef);

  const data: Admin[] = userSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      uid: docData.uid,
      joined_full_name: docData.joined_full_name,
      joined_full_name_lowercase: docData.joined_full_name_lowercase,
      zone: docData.zone,
      position: docData.position,
      gender: docData.gender,
      email: docData.email,
      first_name: docData.first_name,
      middle_name: docData.middle_name,
      last_name: docData.last_name,
    };
  });

  return data;
}

export async function handleSubmit(
  first_name: string,
  middle_name: string,
  last_name: string,
  position: string,
  gender: string,
  email: string,
  password: string
) {
  try {
    // create user accout in firebase auth first
    const user = await createUserWithEmailAndPassword(auth, email, password);

    // insert the event details in the events collection
    const eventData: any = {
      uid: user.user.uid,
      first_name,
      middle_name,
      last_name,
      position,
      gender,
      joined_full_name: `${first_name} ${middle_name[0]}. ${last_name}`,
      joined_full_name_lowercase:
        `${first_name} ${middle_name[0]}. ${last_name}`.toLocaleLowerCase(),
      email,
      role: "admin",
      status: "active",
    };

    // Use setDoc to create a document with the user's uid as the document ID
    const userDocRef = doc(db, "users", user.user.uid);
    await setDoc(userDocRef, eventData);

    revalidatePath("/lingkod/officer-management");

    return { success: true };
  } catch (error) {
    console.error("Error adding officer:", error);
    return { success: false, error: "Error adding officer" };
  }
}

export async function disableAccount(id: string) {
  try {
    const documentRef = doc(db, "users", id);
    await updateDoc(documentRef, { status: "inactive" });

    revalidatePath("/lingkod/officer-management");

    return { success: true };
  } catch (error) {
    console.error("Error adding officer:", error);
    return { success: false, error: "Error adding officer" };
  }
}

export async function getAdminData(id: string): Promise<Admin> {
  const userRef = query(collection(db, "users"), where("uid", "==", id));
  const userSnapshot = await getDocs(userRef);

  const doc = userSnapshot.docs[0];

  const docData = doc.data();

  return {
    id,
    joined_full_name: docData.joined_full_name,
    joined_full_name_lowercase: docData.joined_full_name_lowercase,
    email: docData.email,
    first_name: docData.first_name,
    middle_name: docData.middle_name,
    last_name: docData.last_name,
    gender: docData.gender,
    position: docData.position,
  };
}

export async function handleEdit(
  docId: string,
  first_name: string,
  middle_name: string,
  last_name: string,
  position: string,
  gender: string
) {
  try {
    const userDocRef = doc(db, "users", docId);

    const eventData: any = {
      first_name,
      middle_name,
      last_name,
      joined_full_name: `${first_name} ${middle_name.charAt(0)}. ${last_name}`,
      position,
      gender,
    };

    await updateDoc(userDocRef, eventData);

    revalidatePath("/lingkod/officer-management");

    return { success: true };
  } catch (error) {
    console.error("Error adding officer:", error);
    return { success: false, error: "Error adding officer" };
  }
}
