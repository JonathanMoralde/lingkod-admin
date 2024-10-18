// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { ArrowUpDown } from "lucide-react";

// import { MoreHorizontal, MoreVertical } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { disableAccount } from "./actions";
// import { toast } from "sonner";

// // This type is used to define the shape of our data.
// // You can use a Zod schema here if you want.

// export const columns: ColumnDef<Admin>[] = [
//   {
//     accessorKey: "position",
//     header: "Position",
//   },
//   {
//     accessorKey: "joined_full_name",
//     header: "Full Name",
//   },
//   {
//     accessorKey: "gender",
//     header: "Gender",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const data = row.original;

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
//               <Link href={`/lingkod/officer-management/new/${data.id}`}>
//                 <DropdownMenuItem>Edit details</DropdownMenuItem>
//               </Link>
//               {/* <DropdownMenuItem> */}
//               <AlertDialog>
//                 <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:hover:bg-slate-800">
//                   {" "}
//                   Disable Account
//                 </AlertDialogTrigger>
//                 <AlertDialogContent className="dark:bg-[#4844b4] bg-[#4844b4]">
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       You are about to disable an account
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This action cannot be undone. This will permanently
//                       disable the account.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel className="rounded">
//                       Cancel
//                     </AlertDialogCancel>
//                     <AlertDialogAction
//                       className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950"
//                       onClick={() => {
//                         disableAccount(data.id);

//                         try {
//                             const documentRef = doc(db, "users", id);
//                             await updateDoc(documentRef, {
//                               status: "inactive",
//                             });
//                         } catch (error) {
//                           console.log("An error occured while disabling account", error)
//                           toast.error(
//                             "An error occured while disabling account"
//                           );
//                         }
//                       }}
//                     >
//                       Continue
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//               {/* </DropdownMenuItem> */}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       );
//     },
//   },
// ];
