"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { handleReject } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
  id: string;
};

const RejectBtn = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Button
      variant="destructive"
      className="bg-red-600  rounded hover:bg-[#ff1a1ab6] shadow-lg font-semibold tracking-wide text-indigo-950 w-1/6"
      onClick={async () => {
        setLoading(true);
        try {
          await handleReject(props.id);
          toast.success("Successfully rejected the user!");
        } catch (error) {
          toast.error("failed to update user account status!");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : "Reject"}
    </Button>
  );
};

export default RejectBtn;
