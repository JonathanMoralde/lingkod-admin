"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { db } from "@/config/firebase";
import { updateDoc, doc, Timestamp } from "firebase/firestore";

type Props = { params: { id: string } };

const FormSchema = z.object({
  ctc_no: z.string(),
  ctc_issued_at: z.string(),
  ctc_issued_on: z.date(),
});

const AssignCTC = (props: Props) => {
  const { id } = props.params;

  const router = useRouter();

  const [date, setDate] = React.useState<Date>();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    data: z.infer<typeof FormSchema>
  ) => {
    setLoading(true);
    try {
      const documentRef = doc(db, "requests", id);
      await updateDoc(documentRef, {
        "details.ctc_no": data.ctc_no,
        "details.ctc_issued_at": data.ctc_issued_at,
        "details.ctc_issued_on": Timestamp.fromDate(data.ctc_issued_on),
      });

      toast.success(`Successfully assigned a CTC`);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to assigned a CTC. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <div className="flex items-center  mb-4">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/request">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-lg md:text-xl font-semibold w-full">Assign CTC</h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:w-1/2 lg:w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="ctc_no"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>CTC No.</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter ctc no"
                    {...field}
                    className="placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ctc_issued_at"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Issued at</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter issued on"
                    {...field}
                    className="placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ctc_issued_on"
            render={({ field }) => (
              <FormItem className="flex flex-col mb-5">
                <FormLabel>Issued on</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        " justify-start text-left font-normal",
                        !date && "text-muted-foreground "
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "MMMM dd, yyyy")
                      ) : (
                        <span className="text-gray-400">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      className="bg-[#4844b4]"
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate || undefined);
                        field.onChange(selectedDate || undefined);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              {loading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                "SUBMIT"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default AssignCTC;
