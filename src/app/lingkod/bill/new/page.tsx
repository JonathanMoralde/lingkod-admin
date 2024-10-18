"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { format } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import MonthPicker from "@/components/lingkod/month-picker";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// import { getUsersList, handleSubmit } from "../action";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  where,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const formSchema = z.object({
  bapa_name: z.string(),
  uid: z.string(),
  meter_no: z.string(),
  // meter_no: z.string().transform((val) => Number(val)),
  present_reading: z.string(),
  // present_reading: z.string().transform((val) => Number(val)),
  previous_reading: z.string(),
  // previous_reading: z.string().transform((val) => Number(val)),
  total_due: z.string(),
  // total_due: z.string().transform((val) => Number(val)),
  date_released: z.date(),
  month: z.date(),
  due_date: z.date(),
  disconnection_date: z.date(),
});

type FormSchema = z.infer<typeof formSchema>;

type InputUser = {
  uid: string;
  full_name: string;
};

const PostBill = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  // const [selectedYear, setSelectedYear] = useState<Date | null>(null);
  const [date, setDate] = React.useState<Date>();
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [dueDate, setdueDate] = React.useState<Date>();
  const [disconnectionDate, setdisconnectionDate] = React.useState<Date>();

  // combobox state
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const userRef = query(
        collection(db, "users"),
        where("role", "==", "user"),
        where("status", "==", "approved")
      );
      const userSnapshot = await getDocs(userRef);

      const usersList: InputUser[] = userSnapshot.docs.map((doc) => {
        const docData = doc.data();

        return {
          uid: doc.id,
          full_name: docData.joined_full_name,
        };
      });
      setUsers(
        usersList.map((user) => {
          return { value: user.uid, label: user.full_name };
        })
      );
    };

    fetchUsers();
  }, []);

  const onSubmit: SubmitHandler<FormSchema> = async (
    data: z.infer<typeof formSchema>
  ) => {
    setLoading(true);
    try {
      // await handleSubmit(
      //   data.bapa_name,
      //   data.uid,
      //   data.meter_no,
      //   data.present_reading,
      //   data.previous_reading,
      //   data.total_due,
      //   data.date_released,
      //   data.month,
      //   data.due_date,
      //   data.disconnection_date
      // );
      const collectionRef = collection(db, "bills");

      // insert the event details in the events collection
      const eventData: any = {
        bapa_name: data.bapa_name,
        uid: data.uid,
        meter_no: parseInt(data.meter_no),
        present_reading: parseInt(data.present_reading),
        previous_reading: parseInt(data.previous_reading),
        total_due: parseInt(data.total_due),
        date_released: data.date_released,
        month: data.month,
        due_date: data.due_date,
        disconnection_date: data.disconnection_date,
        status: "unpaid",
      };

      await addDoc(collectionRef, eventData);

      const notificationRef = collection(db, "notifications");
      const notificationData: any = {
        is_read: false,
        receiver_uid: data.uid,
        notif_msg: `Your electric bill for ${format(
          data.month,
          "MMMM"
        )} has been posted!`,
        type: "bill",
        timestamp: serverTimestamp(),
      };

      await addDoc(notificationRef, notificationData);

      toast.success("Bill posted successfully!");
      form.reset({
        bapa_name: "",
        uid: "",
        meter_no: "",
        present_reading: "",
        previous_reading: "",
        total_due: "",
        date_released: undefined,
        month: undefined,
        due_date: undefined,
        disconnection_date: undefined,
      });
      setDate(undefined);
      setSelectedMonth(null);
      setdueDate(undefined);
      setdisconnectionDate(undefined);
      setValue("");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to post a bill. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4   h-[80vh]">
      <div className="py-10">
        <div className="flex items-center  mb-4">
          <Button variant="ghost" size="icon" className=" justify-start">
            <Link href="/lingkod/bill">
              <ArrowLeft />
            </Link>
          </Button>

          <h3 className="text-xl font-semibold w-full">Post Bill</h3>
        </div>

        {/* <div className="w-full"> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-16 mb-6">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="uid"
                  render={({ field }) => (
                    <FormItem className="mb-3 flex flex-col space-y-4">
                      <FormLabel>Select Resident</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className=" justify-between rounded"
                          >
                            {value
                              ? users.find((user) => user.value === value)
                                  ?.label
                              : "Select Resident"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command className="w-full dark:bg-[#4844b4] bg-[#4844b4]">
                            <CommandInput placeholder="Search resident" />
                            <CommandList>
                              <CommandEmpty>No user found.</CommandEmpty>

                              <CommandGroup>
                                <ScrollArea className="max-h-48">
                                  {users.map((user) => (
                                    <CommandItem
                                      key={user.value}
                                      value={user.value}
                                      onSelect={(currentValue) => {
                                        setValue(
                                          currentValue === value
                                            ? ""
                                            : currentValue
                                        );
                                        setOpen(false);
                                        field.onChange(currentValue);
                                        form.setValue(
                                          "bapa_name",
                                          users.find(
                                            (user) =>
                                              user.value === currentValue
                                          )
                                            ? users.find(
                                                (user) =>
                                                  user.value === currentValue
                                              )!.label
                                            : ""
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          value === user.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {user.label}
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage>
                        {form.formState.errors.uid?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="meter_no"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Meter Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter meter number"
                          className="rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.meter_no?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="present_reading"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Present Reading</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter present reading"
                          className="rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.present_reading?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="previous_reading"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Previous Reading</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter previous reading"
                          className="rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.previous_reading?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  name="total_due"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Total Due</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter total due"
                          className="rounded"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.total_due?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="date_released"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 mb-5 mt-1 ">
                      <FormLabel>Date Released</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " justify-start text-left font-normal rounded",
                              !date && "text-muted-foreground "
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span className="text-gray-400">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            className=" bg-[#4844b4]"
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

                <FormField
                  name="month"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 mb-4">
                      <FormLabel>Month & Year</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="justify-start text-left font-normal rounded"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedMonth ? (
                              format(selectedMonth, "MMMM yyyy")
                            ) : (
                              <span className="text-gray-400">
                                Pick a month
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <MonthPicker
                            currentMonth={field.value || new Date()}
                            onMonthChange={(newMonth) => {
                              setSelectedMonth(newMonth);
                              field.onChange(newMonth);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage>
                        {form.formState.errors.month?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 mb-6">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " justify-start text-left font-normal rounded",
                              !dueDate && "text-muted-foreground "
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? (
                              format(dueDate, "PPP")
                            ) : (
                              <span className="text-gray-400">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            className="bg-[##4844b4]"
                            mode="single"
                            selected={dueDate}
                            onSelect={(selectedDueDate) => {
                              setdueDate(selectedDueDate || undefined);
                              field.onChange(selectedDueDate || undefined);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disconnection_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-5">
                      <FormLabel>Disconnection Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " justify-start text-left font-normal rounded",
                              !disconnectionDate && "text-muted-foreground "
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {disconnectionDate ? (
                              format(disconnectionDate, "PPP")
                            ) : (
                              <span className="text-gray-400">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            className="bg-[##4844b4]"
                            mode="single"
                            selected={disconnectionDate}
                            onSelect={(selectedDisconnectionDate) => {
                              setdisconnectionDate(
                                selectedDisconnectionDate || undefined
                              );
                              field.onChange(
                                selectedDisconnectionDate || undefined
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid place-items-center w-1/2 mx-auto">
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
        {/* </div> */}
      </div>
    </ScrollArea>
  );
};

export default PostBill;
