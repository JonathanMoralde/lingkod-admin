"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import ApproveBtn from "./approveBtn";
import RejectBtn from "./rejectBtn";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

type Props = { params: { id: string } };

interface UserDetails {
  id: string;
  full_name: string;
  zone: string;
  email: string;
  status: "pending" | "approved" | "not approved";
  age: number;
  birthday: string;
  block: string;
  civil_status: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  contact_number: string;
  lot: string;
  profile_pic: string;
  sector: string;
  valid_id: string;
}

const ResidentDetail = (props: Props) => {
  const { id }: { id: string } = props.params;

  const [data, setData] = useState<UserDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userRef = query(collection(db, "users"), where("uid", "==", id));
        const userSnapshot = await getDocs(userRef);

        const doc = userSnapshot.docs[0];

        const docData = doc.data();

        setData({
          id: doc.id,
          full_name: docData.joined_full_name, // Omit 'id' from the User type to avoid conflicts
          zone: docData.zone,
          email: docData.email,
          status: docData.status,
          age: docData.age,
          birthday: docData.birthday,
          block: docData.block,
          civil_status: docData.civil_status,
          contact_number: docData.contact_number,
          first_name: docData.first_name,
          middle_name: docData.middle_name,
          last_name: docData.last_name,
          lot: docData.lot,
          gender: docData.gender,
          profile_pic: docData.profile_pic ?? "",
          sector: docData.sector,
          valid_id: docData.valid_id,
        });
      } catch (error) {
        console.log("An error occured while fetching user data", error);
        toast.error("An error occured while fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const changeStatus = (status: "pending" | "approved" | "not approved") => {
    if (data) {
      // Create a new user object with the updated status
      const updatedUser = { ...data, status };
      setData(updatedUser); // Update the state with the new object
    }
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      {loading && data == undefined ? (
        <div className="w-full h-[80vh] grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center text-center mb-10">
            <Button variant="ghost" size="icon" className=" justify-start">
              <Link href="/lingkod/residents">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-xl font-semibold w-full">User Information</h3>
          </div>
          <div className="flex mb-10 gap-10">
            {/* image & btn */}
            <div className="w-1/4 h-full me-4">
              <div className="relative mx-auto w-52 h-52 rounded-full overflow-hidden">
                <Image
                  src={data?.profile_pic ?? ""}
                  alt="Background Image"
                  fill
                  sizes="w-auto h-auto"
                  priority
                />
              </div>
            </div>
            {/* details */}
            <div className="flex w-1/2 justify-between">
              <div>
                <p className="mb-4 font-light">
                  <span className="font-semibold">First Name: </span>
                  {data?.first_name ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Middle Name: </span>
                  {data?.middle_name ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Last Name: </span>
                  {data?.last_name ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Birthday: </span>
                  {data?.birthday ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Civil Status: </span>
                  {data?.civil_status ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Zone: </span>
                  {data?.zone ?? ""}
                </p>
              </div>
              <div>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Age: </span>
                  {data?.age ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Gender: </span>
                  {data?.gender ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Email: </span>
                  {data?.email ?? ""}
                </p>
                <p className="mb-4 font-light">
                  <span className="font-semibold">Contact Number: </span>
                  {data?.contact_number ?? ""}
                </p>
              </div>
            </div>
          </div>

          {data?.status !== undefined && data.status == "pending" ? (
            <div className="w-full">
              <h3 className="text-xl font-semibold text-center w-full mb-10">
                Submitted ID
              </h3>
              <div className="relative mx-auto w-[600px] h-80 mb-10">
                <Image
                  src={data?.valid_id ?? ""}
                  alt="Background Image"
                  fill
                  sizes="w-auto h-auto"
                  objectFit="contain"
                />
              </div>

              <div className="flex justify-center">
                <ApproveBtn id={data?.id ?? ""} changeStatus={changeStatus} />

                <RejectBtn id={data?.id ?? ""} changeStatus={changeStatus} />
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </ScrollArea>
  );
};

export default ResidentDetail;
