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
  serverTimestamp,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { ElectricBill } from "./columns";
import { format } from "date-fns";

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
      due_date: format(
        (docData.due_date as Timestamp).toDate(),
        "MMMM dd, yyyy"
      ),
      disconnection_date: format(
        (docData.disconnection_date as Timestamp).toDate(),
        "MMMM dd,yyyy"
      ),
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

  const userRef = query(
    collection(db, "users"),
    where("role", "==", "user"),
    where("status", "==", "approved")
  );
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

    const notificationRef = collection(db, "notifications");
    const notificationData: any = {
      is_read: false,
      receiver_uid: uid,
      notif_msg: `Your electric bill for ${format(
        month,
        "MMMM"
      )} has been posted!`,
      type: "bill",
      timestamp: serverTimestamp(),
    };

    await addDoc(notificationRef, notificationData);

    revalidatePath("/lingkod/bill");

    return { success: true };
  } catch (error) {
    console.error("Error posting bill:", error);
    return { success: false, error: "Error posting bill" };
  }
}

export type BillDetail = {
  id: string;
  uid: string;
  bapa_name: string;
  meter_no: number;
  present_reading: number;
  previous_reading: number;
  total_due: number;
  date_released: number;
  due_date: number;
  disconnection_date: number;
  month_year: number;
};
export async function getBillData(id: string): Promise<BillDetail> {
  // Fetch data from your API here.

  const billDoc = doc(collection(db, "bills"), id);

  const billDocSnap = await getDoc(billDoc);

  if (billDocSnap.exists()) {
    const docData = billDocSnap.data();

    // Assuming your docData has the correct type annotations
    return {
      id: id,
      uid: docData.uid,
      bapa_name: docData.bapa_name,
      date_released: (docData.date_released as Timestamp).toMillis(),
      disconnection_date: (docData.disconnection_date as Timestamp).toMillis(),
      due_date: (docData.due_date as Timestamp).toMillis(),
      meter_no: docData.meter_no,
      present_reading: docData.present_reading,
      previous_reading: docData.previous_reading,
      total_due: docData.total_due,
      month_year: (docData.month as Timestamp).toMillis(),
    };
  } else {
    throw new Error("Document not found");
  }
}
