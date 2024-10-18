"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

export type ElectricBill = {
  id: string;
  full_name: string;
  total_due: number;
  due_date: string;
  disconnection_date: string;
  status: string;
  uid: string;
};

export const columns: ColumnDef<ElectricBill>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "total_due",
    header: "Total Due",
    cell: ({ row }) => {
      const formattedTotalDue = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 0,
      }).format(row.original.total_due);
      return <span>{formattedTotalDue}</span>;
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.due_date;
      const formattedDate = format(new Date(timestamp), "MMMM dd, yyyy");
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "disconnection_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Disconnection Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.disconnection_date;
      const formattedDate = format(new Date(timestamp), "MMMM dd, yyyy");
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Payment Status",
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
              <Link href={`/lingkod/bill/${data.id}`}>
                <DropdownMenuItem>View details</DropdownMenuItem>
              </Link>
              <Link href={`/lingkod/bill/update-status/${data.id}/${data.uid}`}>
                <DropdownMenuItem>Update Status</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
