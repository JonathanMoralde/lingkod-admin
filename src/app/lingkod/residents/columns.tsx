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
// import { handleApprove } from "./actions";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  full_name: string;
  zone: string;
  email: string;
  status: "pending" | "approved" | "not approved";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "zone",
    header: "Zone",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Account Verification Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      // const handleApproveClick = async (id: string) => {
      //   const result = await handleApprove(id);
      //   if (result.success) {
      //     // Optionally, trigger a client-side update or refresh
      //   } else {
      //     // Handle error
      //     console.error(result.error);
      //   }
      // };

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
              {
                // data.status == "pending" && (
                //   <DropdownMenuItem
                //   // onClick={async () => await handleApprove(data.id)}
                //   >
                //     <Link href={`/lingkod/residents/verify/${data.id}`}>
                //       Verify User
                //     </Link>
                //   </DropdownMenuItem>
                // )
              }
              <Link href={`/lingkod/residents/${data.id}`}>
                <DropdownMenuItem>
                  {data.status == "pending" ? "Verify Account" : "View details"}
                </DropdownMenuItem>
              </Link>
              <Link href={`/lingkod/residents/edit/${data.id}`}>
                <DropdownMenuItem>Edit details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
