"use client";
import React, { useEffect, useState } from "react";
// import { Admin, columns } from "./columns";
import { DataTable } from "../../../components/lingkod/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { getData } from "./actions";
import { Loader2 } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

export type Admin = {
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

// export const dynamic = "force-dynamic";

const OfficerManagement = () => {
  // const data: Admin[] = await getData();
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRef = query(
          collection(db, "users"),
          where("role", "==", "admin"),
          where("status", "==", "active"),
          orderBy("position")
        );
        const userSnapshot = await getDocs(userRef);

        const result: Admin[] = userSnapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            uid: docData.uid,
            joined_full_name: docData.joined_full_name,
            joined_full_name_lowercase: docData.joined_full_name_lowercase,
            zone: docData.zone,
            position: docData.position,
            gender: docData.gender,
            email: docData.email,
            first_name: docData.first_name,
            middle_name: docData.middle_name,
            last_name: docData.last_name,
          };
        });

        setAdmin(result);
      } catch (error) {
        console.log("An error occured while fetching data", error);
        toast.error("An error occured while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "joined_full_name",
      header: "Full Name",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-[#4844B4]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/lingkod/officer-management/new/${data.id}`}>
                  <DropdownMenuItem>Edit details</DropdownMenuItem>
                </Link>
                {/* <DropdownMenuItem> */}
                <AlertDialog>
                  <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:hover:bg-slate-800">
                    {" "}
                    Disable Account
                  </AlertDialogTrigger>
                  <AlertDialogContent className="dark:bg-[#4844b4] bg-[#4844b4]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        You are about to disable an account
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        disable the account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950"
                        onClick={async () => {
                          // disableAccount(data.id);

                          try {
                            const documentRef = doc(db, "users", data.id);
                            await updateDoc(documentRef, {
                              status: "inactive",
                            });

                            let tempData = admin;
                            const result = tempData.filter(
                              (a) => a.id !== data.id
                            );
                            setAdmin([...result]);
                          } catch (error) {
                            console.log(
                              "An error occured while disabling account",
                              error
                            );
                            toast.error(
                              "An error occured while disabling account"
                            );
                          }
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      {loading ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="mb-2 flex justify-between">
            <h3 className="text-xl font-semibold ">Officer Management</h3>

            <Link href="/lingkod/officer-management/new">
              <Button
                variant="default"
                className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 "
              >
                New Officer
              </Button>
            </Link>
          </div>
          <DataTable columns={columns} data={admin} />
        </>
      )}
    </section>
  );
};

export default OfficerManagement;
