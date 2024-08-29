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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DocRequest = {
  id: string;
  full_name: string;
  type: string;
  date_requested: number;
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
                <>
                  <DropdownMenuItem
                    onClick={async () => {
                      await handleApprove(data.id);
                    }}
                  >
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await handleReject(data.id);
                    }}
                  >
                    Decline
                  </DropdownMenuItem>
                </>
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
