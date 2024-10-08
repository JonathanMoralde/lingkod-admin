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
import Link from "next/link";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type HouseholdMember = {
  name: string;
  age: string;
};

export const columns: ColumnDef<HouseholdMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const data = row.original;

  //       // const handleApproveClick = async (id: string) => {
  //       //   const result = await handleApprove(id);
  //       //   if (result.success) {
  //       //     // Optionally, trigger a client-side update or refresh
  //       //   } else {
  //       //     // Handle error
  //       //     console.error(result.error);
  //       //   }
  //       // };

  //       return (
  //         <div className="text-center">
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild className="">
  //               <Button variant="ghost" className="h-8 w-8 p-0">
  //                 <span className="sr-only">Open menu</span>
  //                 <MoreVertical className="h-4 w-4" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end" className="dark:bg-[#4844B4]">
  //               <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //               <DropdownMenuSeparator />
  //               <Link href={`/lingkod/household/${data.id}`}>
  //                 <DropdownMenuItem>View details</DropdownMenuItem>
  //               </Link>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>
  //       );
  //     },
  //   },
];
