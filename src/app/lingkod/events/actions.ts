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

export type Event = {
  id: string;
  event_title: string;
  description: string;
  event_date: number;
  event_pic: string;
};

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  event_date: number;
  event_pic: string;
  event_time?: string;
  event_location?: string;
}

export async function getData(): Promise<Event[]> {
  // Fetch data from your API here.

  const eventRef = query(
    collection(db, "events"),
    orderBy("event_date", "desc")
  );
  const eventSnapshot = await getDocs(eventRef);

  const data: Event[] = eventSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      event_title: docData.title as string, // Omit 'id' from the User type to avoid conflicts
      description: docData.description as string,
      event_date: (docData.event_date as Timestamp).toMillis(),
      event_pic: docData.event_pic as string,
    };
  });

  return data;
}

export async function getEventData(id: string): Promise<EventDetails> {
  // Fetch data from your API here.

  const eventDoc = doc(collection(db, "events"), id);

  const eventDocSnap = await getDoc(eventDoc);

  if (eventDocSnap.exists()) {
    const docData = eventDocSnap.data();

    // Assuming your docData has the correct type annotations
    return {
      id: id,
      title: docData?.title,
      description: docData?.description,
      category: docData?.category,
      event_date: (docData?.event_date as Timestamp).toMillis(),
      event_pic: docData?.event_pic,
      event_location: docData?.event_location,
      event_time: docData?.event_time,
    };
  } else {
    throw new Error("Document not found");
  }
}

const base64ToBlob = (base64: string): Blob => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

export async function handleSubmit(
  fileBase64: string,
  title: string,
  body: string,
  date: number,
  category: string,
  location?: string,
  time?: string
) {
  try {
    const collectionRef = collection(db, "events");

    //   upload image first in firebase storage
    const fileBlob = base64ToBlob(JSON.parse(fileBase64));

    const storageRef = ref(storage, `events/${title}/event_image`);
    const snapshot = await uploadBytes(storageRef, fileBlob);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // insert the event details in the events collection
    const eventData: any = {
      title,
      description: body,
      event_date: Timestamp.fromMillis(date),
      event_pic: imageUrl,
      category,
    };

    // Conditionally add optional fields
    if (location) {
      eventData.event_location = location;
    }

    if (time) {
      eventData.event_time = time;
    }
    await addDoc(collectionRef, eventData);

    revalidatePath("/lingkod/events");

    return { success: true };
  } catch (error) {
    console.error("Error posting event:", error);
    return { success: false, error: "Error posting event" };
  }
}

export async function handleDelete(id: string) {
  try {
    const documentRef = doc(collection(db, "events"), id);

    await deleteDoc(documentRef);

    revalidatePath("/lingkod/events");
  } catch (error) {
    console.error("Error deleting:", error);
    return { success: false, error: "Error deleting" };
  }
}

export async function handleEdit(
  id: string,
  fileBase64: string,
  title: string,
  body: string,
  date: number,
  category: string,
  location?: string,
  time?: string
) {
  try {
    const documentRef = doc(collection(db, "events"), id);

    //   upload image first in firebase storage
    const fileBlob = base64ToBlob(JSON.parse(fileBase64));

    const storageRef = ref(storage, `events/${title}/event_image`);
    const snapshot = await uploadBytes(storageRef, fileBlob);
    const imageUrl = await getDownloadURL(snapshot.ref);

    const eventData: any = {
      title,
      description: body,
      event_date: Timestamp.fromMillis(date),
      event_pic: imageUrl,
      category,
    };

    // Conditionally add optional fields
    if (location) {
      eventData.event_location = location;
    }

    if (time) {
      eventData.event_time = time;
    }

    await updateDoc(documentRef, eventData);

    revalidatePath("/lingkod/events");

    return { success: true };
  } catch (error) {
    console.error("Error posting event:", error);
    return { success: false, error: "Error posting event" };
  }
}
