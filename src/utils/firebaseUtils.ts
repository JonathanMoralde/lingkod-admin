import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Define the type for the BarangayOfficial
export type BarangayOfficial = {
  id: string;
  full_name: string;
  position: string;
};

// Fetch a barangay official based on the position
export const fetchBarangayOfficial = async (
  position: string
): Promise<BarangayOfficial> => {
  const officialQuery = query(
    collection(db, "users"),
    where("role", "==", "admin"),
    where("position", "==", position),
    where("status", "==", "active")
  );

  const officialSnapshot = await getDocs(officialQuery);
  const officialDoc = officialSnapshot.docs[0]?.data();

  if (officialDoc) {
    return {
      id: officialSnapshot.docs[0].id,
      full_name: officialDoc.joined_full_name,
      position: officialDoc.position,
    };
  }

  throw new Error(`${position} not found`);
};
