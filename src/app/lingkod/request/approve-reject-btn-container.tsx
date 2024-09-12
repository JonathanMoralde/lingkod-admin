"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { DocRequest } from "./columns";
import { handleApprove, handleReject } from "./actions";

type Props = { data: DocRequest };

const ApproveRejectContainer = ({ data }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <>
        <DropdownMenuItem
          onClick={async () => {
            setLoading(true);
            await handleApprove(data.id, data.uid, data.type).then((_) => {
              setLoading(false);
            });
          }}
        >
          Accept
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            setLoading(true);
            await handleReject(data.id, data.uid, data.type).then((_) => {
              setLoading(false);
            });
          }}
        >
          Decline
        </DropdownMenuItem>
      </>
    </>
  );
};

export default ApproveRejectContainer;
