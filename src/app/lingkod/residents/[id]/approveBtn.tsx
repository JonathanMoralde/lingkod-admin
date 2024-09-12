"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { handleApprove } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  id: string;
};

const ApproveBtn = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Button
      variant="default"
      className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/6"
      onClick={async () => {
        setIsLoading(true);
        try {
          await handleApprove(props.id);
          toast.success("Successfully approved the user!");
        } catch (error) {
          toast.error("failed to update user account status!");
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? <Loader2 className="h-10 w-10 animate-spin" /> : "Approve"}
    </Button>
  );
};

export default ApproveBtn;
