"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { MoreHorizontal, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { format } from "date-fns";
import Link from "next/link";
import { handleApprove, handleReject } from "./actions";
import ApproveRejectContainer from "./approve-reject-btn-container";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DocRequest = {
  id: string;
  uid: string;
  full_name: string;
  type: string;
  date_requested: string;
  status: "pending" | "accepted" | "declined";
};

export const columns: ColumnDef<DocRequest>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "type",
    header: "Document",
  },
  {
    accessorKey: "date_requested",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Requested
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.date_requested;
      const formattedDate = format(new Date(timestamp), "MMMM dd, yyyy");
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
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
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              {data.status == "pending" && (
                <ApproveRejectContainer data={data} />
              )}
              {data.type == "Barangay Clearance" ||
              data.type == "Business Permit" ? (
                <Link href={`/lingkod/request/assign-ctc/${data.id}`}>
                  <DropdownMenuItem>Assign CTC</DropdownMenuItem>
                </Link>
              ) : (
                ""
              )}
              {data.type == "Business Permit" && (
                <Link href={`/lingkod/request/assign-or/${data.id}`}>
                  <DropdownMenuItem>Assign OR</DropdownMenuItem>
                </Link>
              )}

              <Link href={`/pdf/${data.id}`} target="_blank">
                <DropdownMenuItem>View details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
