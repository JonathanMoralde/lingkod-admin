"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { format, formatDate } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
// If you are using date-fns v3.x, please import the v3 adapter
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { getEventData, handleEdit } from "../actions";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

type Props = { params: { id: string } };

// Define the form schema using Zod

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, "Max file size is 5MB"),
  title: z.string().min(1, "Event title is required"),
  body: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Event Location is required"),
  date: z.date({
    required_error: "Event date is required",
  }),
  time: z.date({
    required_error: "Event time is required",
  }),
});

type FormData = z.infer<typeof formSchema>;

const EditEvent = (props: Props) => {
  const { id }: { id: string } = props.params;

  const router = useRouter();

  const [date, setDate] = React.useState<Date>();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [time, setTime] = React.useState<Date | null>(null);

  // Set up React Hook Form with Zod validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const eventData = await getEventData(id);

        // Set the form values using the fetched event data
        form.setValue("title", eventData.title);
        form.setValue("body", eventData.description);
        form.setValue("location", eventData.event_location);
        form.setValue("date", new Date(eventData.event_date)); // Convert the timestamp to a Date object
        setDate(new Date(eventData.event_date));

        // Set the image preview if there's an event_pic URL
        if (eventData.event_pic) {
          setImagePreview(eventData.event_pic);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEventDetail();
  }, [id, form]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormData> = async (
    data: z.infer<typeof formSchema>
  ) => {
    console.log(data);
    // Handle form submission logic here
    try {
      const fileBase64 = await fileToBase64(data.image);
      console.log(
        fileBase64,
        data.title,
        data.body,
        Timestamp.fromDate(data.date).toMillis(),
        data.location,
        format(data.time, "hh:mm aa")
      );
      await handleEdit(
        id,
        JSON.stringify(fileBase64),
        data.title,
        data.body,
        Timestamp.fromDate(data.date).toMillis(),
        data.location,
        format(data.time, "hh:mm aa")
      );
      toast.success("Event was updated successfully!");
      form.reset({
        image: undefined,
        title: "",
        body: "",
        location: "",
        date: undefined,
        time: undefined,
      });
      setDate(undefined);
      setTime(null);
      setImagePreview(null);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to update the event. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      <div className="flex items-center  mb-10">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/events">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold w-full">Edit Event</h3>
      </div>
      <div className="flex justify-between">
        <div className="w-1/3 me-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Event Picture</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        className={`${
                          imagePreview !== null ? "text-white" : "text-gray-400"
                        } border-gray-200`}
                        accept=".png,.jpg"
                        placeholder="Picture"
                        type="file"
                        // accept="image/*, application/pdf"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setImagePreview(URL.createObjectURL(file));
                          } else {
                            onChange(null);
                            setImagePreview(null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Event title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
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
                name="body"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl className="dark:bg-transparent dark:border-gray-300 ">
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Event Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter location"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-5">
                    <FormLabel>Event Date</FormLabel>
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
                            format(date, "PPP")
                          ) : (
                            <span className="text-gray-400">Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
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
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-6">
                    <FormLabel>Event Time</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker
                        className="border-gray-300"
                        slotProps={{
                          textField: {
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#d1d5db", // Border color
                                },
                                "&:hover fieldset": {
                                  borderColor: "#d1d5db", // Border color on hover
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#d1d5db", // Border color when focused
                                },
                              },
                              "& .MuiInputBase-input": {
                                color: "#d1d5db", // Font color
                              },
                              "& .MuiInputLabel-root": {
                                color: "#d1d5db", // Label color
                              },
                            },
                          },
                        }}
                        value={time}
                        onChange={(newValue) => {
                          setTime(newValue);
                          field.onChange(newValue);
                        }}
                      />
                    </LocalizationProvider>
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
        </div>
        <div className="w-1/2">
          {imagePreview ? (
            <div className="relative w-3/4 h-3/4 mx-auto">
              <Image
                src={imagePreview}
                alt="Preview Image"
                fill
                objectFit="contain"
                sizes="w-auto h-auto"
              />
            </div>
          ) : (
            // <img
            //   src={imagePreview}
            //   alt="Preview"
            //   className="max-w-xs max-h-80 object-cover mt-4"
            // />
            <p className="text-gray-400 text-center">No image selected</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default EditEvent;
