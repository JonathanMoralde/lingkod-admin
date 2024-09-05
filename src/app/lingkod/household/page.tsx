import React from "react";
import { columns, HouseholdDetail } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { getData } from "./actions";

export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const data: HouseholdDetail[] = await getData();
  // This is only needed if you have dynamic routes like [id].tsx
  // return data.map(item => ({ id: item.id })); // Assuming you have dynamic paths
  return []; // Otherwise, return an empty array if no dynamic params
}
const Household = async () => {
  const data: HouseholdDetail[] = await getData();

  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <h3 className="text-xl font-semibold mb-2">Household</h3>

      <DataTable columns={columns} data={data} />
    </section>
  );
};

export default Household;
