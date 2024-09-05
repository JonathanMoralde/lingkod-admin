"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Calendar } from "@/components/ui/calendar";

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
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { assignORNo } from "../../actions";
import { Timestamp } from "firebase/firestore";

type Props = { params: { id: string } };

const FormSchema = z.object({
  or_no: z.string(),
  or_issued_on: z.date(),
});
const AssignOR = (props: Props) => {
  const { id } = props.params;

  const router = useRouter();

  const [date, setDate] = React.useState<Date>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    data: z.infer<typeof FormSchema>
  ) => {
    try {
      await assignORNo(
        id,
        data.or_no,
        Timestamp.fromDate(data.or_issued_on).toMillis()
      );
      toast.success(`Successfully assigned a OR`);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to assigned a OR. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
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

        <h3 className="text-xl font-semibold w-full">Assign OR</h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="or_no"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>OR No.</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter or no"
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
            name="or_issued_on"
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
              SUBMIT
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default AssignOR;
