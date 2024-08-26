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
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  getAuth,
  User,
} from "firebase/auth";
import { revalidatePath } from "next/cache";

export type CurrentAdmin = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  joined_full_name_lowercase: string;
  joined_full_name: string;
  gender: string;
  position: string;
  email: string;
};

export async function getCurrentAdminData(id: string): Promise<CurrentAdmin> {
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
      position,
      gender,
    };

    await updateDoc(userDocRef, eventData);

    revalidatePath("/lingkod/settings/profile");

    return { success: true };
  } catch (error) {
    console.error("Error adding officer:", error);
    return { success: false, error: "Error adding officer" };
  }
}
