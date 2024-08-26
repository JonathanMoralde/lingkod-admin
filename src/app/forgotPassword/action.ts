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
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { sendPasswordResetEmail } from "firebase/auth";

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}
