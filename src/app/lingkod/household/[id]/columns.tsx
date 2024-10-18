"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HouseholdMember } from "../columns";

export const columns: ColumnDef<HouseholdMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];
