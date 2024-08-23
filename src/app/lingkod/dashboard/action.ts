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

export async function getResidentCount(): Promise<number> {
  try {
    // Create a query to filter users with the role "user"
    const userQuery = query(
      collection(db, "users"),
      where("role", "==", "user")
    );

    // Execute the query
    const querySnapshot = await getDocs(userQuery);

    // Count the number of documents in the query snapshot
    const userCount = querySnapshot.size;

    return userCount;
  } catch (error) {
    console.error("Error getting user count: ", error);
    return 0;
  }
}

export async function getBlotterCount(): Promise<number> {
  try {
    // Create a query to filter users with the role "user"
    const reportsCollection = query(collection(db, "reports"));
    // Execute the query
    const querySnapshot = await getDocs(reportsCollection);

    // Count the number of documents in the query snapshot
    const reportsCount = querySnapshot.size;
    return reportsCount;
  } catch (error) {
    console.error("Error getting user count: ", error);
    return 0;
  }
}

export async function getRequestsCount(): Promise<number> {
  try {
    // Create a query to filter users with the role "user"
    const requestsCollection = query(collection(db, "requests"));
    // Execute the query
    const querySnapshot = await getDocs(requestsCollection);

    // Count the number of documents in the query snapshot
    const requestsCount = querySnapshot.size;
    return requestsCount;
  } catch (error) {
    console.error("Error getting user count: ", error);
    return 0;
  }
}

export async function getEventsCount(): Promise<number> {
  try {
    // Create a query to filter users with the role "user"
    const eventsCollection = query(collection(db, "events"));
    // Execute the query
    const querySnapshot = await getDocs(eventsCollection);

    // Count the number of documents in the query snapshot
    const eventsCount = querySnapshot.size;
    return eventsCount;
  } catch (error) {
    console.error("Error getting user count: ", error);
    return 0;
  }
}
