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
