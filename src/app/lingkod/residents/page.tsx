import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaEllipsisV } from "react-icons/fa";
import { Input } from "@/components/ui/input";

import { User, columns } from "./columns";
import { DataTable } from "./data-table";

const Residents = () => {
  const payments: User[] = [
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH3",
      full_name: "Test Y Sheesh",
      zone: "3",
      status: "pending",
      email: "test@gmail.com",
    },
    {
      id: "YiDEQ77g4CPpwoHpviyTzpKJBuH4",
      full_name: "Test 2",
      zone: "1",
      status: "pending",
      email: "test2@gmail.com",
    },
    // ...
  ];

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10 h-full">
      <h3 className="text-xl font-semibold mb-2">Records</h3>
      {/* <div className="w-full mb-6">
        <div className="w-1/4">
          <Input
            className="text-gray-400 rounded  hover:text-white transition-all"
            placeholder="Search Records"
          />
        </div>
      </div>

      <Table className="">
        <TableHeader className="">
          <TableRow className="border-gray-400">
            <TableHead>Full Name</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Account Status</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          <TableRow>
            <TableCell className="font-medium">Jonathan Y Sheesh</TableCell>
            <TableCell>3</TableCell>
            <TableCell>Not Approved</TableCell>
            <TableCell className="text-right">
              <FaEllipsisV />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table> */}

      <DataTable columns={columns} data={payments} />
    </section>
  );
};

export default Residents;
