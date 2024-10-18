"use client";
import React, { useEffect, useState } from "react";

import { User, columns } from "./columns";
import { DataTable } from "../../../components/lingkod/data-table";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { db } from "@/config/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

const Residents = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // FETCH USERS
        const userRef = query(
          collection(db, "users"),
          where("role", "==", "user")
        );
        const userSnapshot = await getDocs(userRef);

        const userData: User[] = userSnapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            full_name: docData.joined_full_name, // Omit 'id' from the User type to avoid conflicts
            zone: docData.zone,
            email: docData.email,
            status: docData.status,
          };
        });

        setData(userData);
      } catch (error) {
        console.log("An error occured while fetching data", error);
        toast.error("An error occured while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">Records</h3>

          <DataTable columns={columns} data={data} />
        </>
      )}
    </section>
  );
};

export default Residents;
