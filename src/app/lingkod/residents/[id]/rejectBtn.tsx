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

const RejectBtn = ({ id, changeStatus }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      const documentRef = doc(db, "users", id);
      await updateDoc(documentRef, { status: "rejected" });
      changeStatus("not approved");
      toast.success("Successfully rejected the user!");
    } catch (error) {
      toast.error("failed to update user account status!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      variant="destructive"
      className="bg-red-600  rounded hover:bg-[#ff1a1ab6] shadow-lg font-semibold tracking-wide text-indigo-950 w-1/6"
      onClick={handleReject}
    >
      {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : "Reject"}
    </Button>
  );
};

export default RejectBtn;
