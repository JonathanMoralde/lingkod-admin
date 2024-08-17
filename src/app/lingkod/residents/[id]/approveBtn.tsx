"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { handleApprove } from "../actions";
import { toast } from "sonner";

type Props = {
  id: string;
};

const ApproveBtn = (props: Props) => {
  return (
    <Button
      variant="default"
      className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/6"
      onClick={async () => {
        try {
          await handleApprove(props.id);
          toast.success("Successfully approved the user!");
        } catch (error) {
          toast.error("failed to update user account status!");
        }
      }}
    >
      Approve
    </Button>
  );
};

export default ApproveBtn;
