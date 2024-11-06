"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { db } from "@/config/firebase";
import { updateDoc, doc } from "firebase/firestore";

type Props = {
  id: string;
  changeStatus: (status: "pending" | "approved" | "not approved") => void;
};

const ApproveBtn = ({ id, changeStatus }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const documentRef = doc(db, "users", id);
      await updateDoc(documentRef, { status: "approved" });
      changeStatus("approved");
      toast.success("Successfully approved the user!");
    } catch (error) {
      toast.error("failed to update user account status!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant="default"
      className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/4 lg:w-1/6 text-sm md:text-base"
      onClick={handleApprove}
    >
      {isLoading ? <Loader2 className="h-10 w-10 animate-spin" /> : "Approve"}
    </Button>
  );
};

export default ApproveBtn;
