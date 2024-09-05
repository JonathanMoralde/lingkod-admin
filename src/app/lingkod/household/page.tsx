import React from "react";
import { columns, HouseholdDetail } from "./columns";
import { DataTable } from "@/components/lingkod/data-table";
import { getData } from "./actions";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

// export async function getServerSideProps() {
//   // Fetch data from external API
//   const data: HouseholdDetail[] = await getData();

//   // Pass data to the page via props
//   return { props: { data } };
// }
// const Household = async ({
//   data,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
export const dynamic = "force-dynamic";
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
