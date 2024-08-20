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
} from "firebase/firestore";

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
  location: string,
  time: string
) {
  try {
    const collectionRef = collection(db, "events");

    //   upload image first in firebase storage
    const fileBlob = base64ToBlob(JSON.parse(fileBase64));

    const storageRef = ref(storage, `events/${title}/event_image`);
    const snapshot = await uploadBytes(storageRef, fileBlob);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // insert the event details in the events collection
    await addDoc(collectionRef, {
      title,
      description: body,
      event_date: Timestamp.fromMillis(date),
      event_pic: imageUrl,
      event_location: location,
      event_time: time,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Error updating status" };
  }
}
