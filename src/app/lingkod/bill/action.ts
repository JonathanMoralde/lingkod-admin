"use server";

import { db, storage } from "@/config/firebase";
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
import { ElectricBill } from "./columns";

export async function getData(): Promise<ElectricBill[]> {
  // Fetch data from your API here.

  const eventRef = query(collection(db, "bills"), orderBy("month", "desc"));
  const eventSnapshot = await getDocs(eventRef);

  const data: ElectricBill[] = eventSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      full_name: docData.bapa_name as string, // Omit 'id' from the User type to avoid conflicts
      total_due: docData.total_due as number,
      due_date: (docData.due_date as Timestamp).toMillis(),
      disconnection_date: (docData.disconnection_date as Timestamp).toMillis(),
    };
  });

  return data;
}

type InputUser = {
  uid: string;
  full_name: string;
};

export async function getUsersList(): Promise<InputUser[]> {
  // Fetch data from your API here.

  const userRef = query(collection(db, "users"), where("role", "==", "user"));
  const userSnapshot = await getDocs(userRef);

  const data: InputUser[] = userSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      uid: doc.id,
      full_name: docData.joined_full_name,
    };
  });

  return data;
}

export async function handleSubmit(
  bapa_name: string,
  uid: string,
  meter_no: string,
  present_reading: string,
  previous_reading: string,
  total_due: string,
  date_released: Date,
  month: Date,
  due_date: Date,
  disconnection_date: Date
) {
  try {
    const collectionRef = collection(db, "bills");

    // insert the event details in the events collection
    const eventData: any = {
      bapa_name,
      uid,
      meter_no: parseInt(meter_no),
      present_reading: parseInt(present_reading),
      previous_reading: parseInt(previous_reading),
      total_due: parseInt(total_due),
      date_released,
      month,
      due_date,
      disconnection_date,
    };

    await addDoc(collectionRef, eventData);

    revalidatePath("/lingkod/bill");

    return { success: true };
  } catch (error) {
    console.error("Error posting event:", error);
    return { success: false, error: "Error posting event" };
  }
}
