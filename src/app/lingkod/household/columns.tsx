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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type HouseholdDetail = {
  id: string;
  household_head: string;
  address: string;
  member_no: number;
  contact_no: string;
};

export const columns: ColumnDef<HouseholdDetail>[] = [
  {
    accessorKey: "household_head",
    header: "Household Head",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "member_no",
    header: "Number of Members",
  },
  {
    accessorKey: "contact_no",
    header: "Contact Number",
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
  //               {/* <DropdownMenuItem
  //                 onClick={() => navigator.clipboard.writeText(payment.id)}
  //               >
  //                 Copy payment ID
  //               </DropdownMenuItem> */}
  //               <DropdownMenuSeparator />
  //               {
  //                 // data.status == "pending" && (
  //                 //   <DropdownMenuItem
  //                 //   // onClick={async () => await handleApprove(data.id)}
  //                 //   >
  //                 //     <Link href={`/lingkod/residents/verify/${data.id}`}>
  //                 //       Verify User
  //                 //     </Link>
  //                 //   </DropdownMenuItem>
  //                 // )
  //               }
  //               {/* <Link href={`/lingkod/residents/${data.id}`}>
  //                 <DropdownMenuItem>
  //                   {data.status == "pending" ? "Verify Account" : "View details"}
  //                 </DropdownMenuItem>
  //               </Link>
  //               <Link href={`/lingkod/residents/edit/${data.id}`}>
  //                 <DropdownMenuItem>Edit details</DropdownMenuItem>
  //               </Link> */}
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>
  //       );
  //     },
  //   },
];
