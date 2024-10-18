"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
// import { DocRequest } from "./columns";
// import { handleApprove, handleReject } from "./actions";
// import { DocRequest } from "./page";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { DocRequest } from "./columns";

type Props = {
  data: DocRequest;
  changeStatus: (
    status: "pending" | "approved" | "rejected",
    data: DocRequest
  ) => void;
};

const ApproveRejectContainer = ({ data, changeStatus }: Props) => {
  const handleApprove = async () => {
    try {
      const documentRef = doc(db, "requests", data.id);
      await updateDoc(documentRef, { status: "approved" });
      changeStatus("approved", data);

      const notificationRef = collection(db, "notifications");
      const notificationData: any = {
        is_read: false,
        receiver_uid: data.uid,
        notif_msg: `${data.type} is ready to be claimed at the Barangay Hall.`,
        type: "request",
        timestamp: serverTimestamp(),
      };

      await addDoc(notificationRef, notificationData);
    } catch (error) {
      console.log("An error occured while changing status", error);
      toast.error("An error occured while changing status");
    }
  };

  const handleReject = async () => {
    try {
      const documentRef = doc(db, "requests", data.id);
      await updateDoc(documentRef, { status: "rejected" });
      changeStatus("rejected", data);

      const notificationRef = collection(db, "notifications");
      const notificationData: any = {
        is_read: false,
        receiver_uid: data.uid,
        notif_msg: `Your request for ${data.type} has been rejected`,
        type: "request",
        timestamp: serverTimestamp(),
      };

      await addDoc(notificationRef, notificationData);
    } catch (error) {
      console.log("An error occured while changing status", error);
      toast.error("An error occured while changing status");
    }
  };
  return (
    <>
      <>
        <DropdownMenuItem onClick={handleApprove}>Accept</DropdownMenuItem>
        <DropdownMenuItem onClick={handleReject}>Decline</DropdownMenuItem>
      </>
    </>
  );
};

export default ApproveRejectContainer;
