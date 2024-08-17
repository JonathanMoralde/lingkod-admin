"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { handleReject } from "../actions";
import { toast } from "sonner";

type Props = {
  id: string;
};

const RejectBtn = (props: Props) => {
  return (
    <Button
      variant="destructive"
      className="bg-red-600  rounded hover:bg-[#ff1a1ab6] shadow-lg font-semibold tracking-wide text-indigo-950 w-1/6"
      onClick={async () => {
        try {
          await handleReject(props.id);
          toast.success("Successfully rejected the user!");
        } catch (error) {
          toast.error("failed to update user account status!");
        }
      }}
    >
      Reject
    </Button>
  );
};

export default RejectBtn;
