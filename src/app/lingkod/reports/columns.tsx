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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Report = {
  id: string;
  case_no?: number;
  complainant: string;
  date_reported: string;
  time_reported: string;
  what: string;
  status: string;
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "case_no",
    header: "Case No.",
    cell: ({ getValue }) => {
      const caseNo = getValue<number | undefined>();
      return caseNo != null ? caseNo : "Not assigned yet";
    },
  },
  {
    accessorKey: "complainant",
    header: "Complainant",
  },
  {
    accessorKey: "what",
    header: "About",
  },
  {
    accessorKey: "date_reported",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Reported
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "time_reported",
    header: "Time Reported",
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
              <DropdownMenuSeparator />
              <Link href={`/lingkod/reports/edit/case-no/${data.id}`}>
                <DropdownMenuItem>Assign Case No.</DropdownMenuItem>
              </Link>

              <Link href={`/lingkod/reports/edit/status/${data.id}`}>
                <DropdownMenuItem>Update Status</DropdownMenuItem>
              </Link>
              <Link href={`/pdf/blotter/${data.id}`} target="_blank">
                <DropdownMenuItem>View details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
