"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignCaseNo, handleStatus } from "../../../../actions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

type Props = { params: { id: string; uid: string } };

const FormSchema = z.object({
  case_no: z.number(),
});

const EditCaseNo = (props: Props) => {
  const { id, uid }: { id: string; uid: string } = props.params;

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    data: z.infer<typeof FormSchema>
  ) => {
    try {
      await assignCaseNo(id, data.case_no, uid);
      toast.success(`Successfully assigned a case number`);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to assigned a case number. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <div className="flex items-center  mb-10">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/reports">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold w-full">Assign Case Number</h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="case_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case No.</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter case number"
                    value={field.value || ""} // Ensure it's an empty string if undefined
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number on change
                    className="rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid place-items-center">
            <Button
              type="submit"
              variant="default"
              className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/2"
            >
              SUBMIT
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default EditCaseNo;
