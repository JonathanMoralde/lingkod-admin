"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
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

import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
// If you are using date-fns v3.x, please import the v3 adapter
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { db, storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

type Props = { params: { id: string } };

// Define the form schema using Zod

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, "Max file size is 5MB")
    .refine(
      (file) => ["image/png", "image/jpeg"].includes(file.type),
      "Only PNG and JPG formats are allowed."
    ),
  title: z.string().min(1, "Event title is required"),
  body: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.date().optional(),
  category: z.string(),
});

const refinedFormSchema = formSchema.refine(
  (data) => {
    if (data.category === "event") {
      return data.location && data.time;
    }
    return true;
  },
  {
    message: "Location and Time are required for events.",
    path: ["location"], // Highlight the first missing field, can also use "time" or handle both separately
  }
);

type FormData = z.infer<typeof refinedFormSchema>;

const EditEvent = (props: Props) => {
  const { id }: { id: string } = props.params;

  const router = useRouter();

  const [date, setDate] = React.useState<Date>();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [time, setTime] = React.useState<Date | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Set up React Hook Form with Zod validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setIsFetching(true);
        const eventDoc = doc(collection(db, "events"), id);

        const eventDocSnap = await getDoc(eventDoc);

        if (eventDocSnap.exists()) {
          const docData = eventDocSnap.data();

          // Set the form values using the fetched event data
          form.setValue("title", docData.title);
          form.setValue("body", docData.description);
          form.setValue("location", docData.event_location);
          form.setValue("date", new Date(docData.event_date)); // Convert the timestamp to a Date object

          // Set the image preview if there's an event_pic URL
          if (docData.event_pic) {
            setImagePreview(docData.event_pic);
          }
        }
      } catch (error) {
        console.error("Error fetching event data: ", error);
        toast.error(`Error fetching event data`);
      } finally {
        setIsFetching(false);
      }
    };

    fetchEventDetail();
  }, [id, form]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormData> = async (
    data: z.infer<typeof formSchema>
  ) => {
    setLoading(true);
    console.log(data);
    // Handle form submission logic here
    try {
      const documentRef = doc(collection(db, "events"), id);

      const storageRef = ref(
        storage,
        `events/${data.title}/${format(data.date, "MM-dd-yyyy")}/event_image`
      );
      const snapshot = await uploadBytes(storageRef, data.image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const eventData: any = {
        title: data.title,
        description: data.body,
        event_date: Timestamp.fromDate(data.date),
        event_pic: imageUrl,
        category: data.category,
      };

      // Conditionally add optional fields
      if (data.location) {
        eventData.event_location = data.location;
      }

      if (data.time) {
        eventData.event_time = format(data.time, "hh:mm aa");
      }

      await updateDoc(documentRef, eventData);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4 py-10 min-h-[80vh]">
      {isFetching ? (
        <div className="w-full h-[80vh] grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center  mb-4">
            <Button variant="ghost" size="icon" className=" justify-start">
              <Link href="/lingkod/events/all">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-lg md:text-xl font-semibold w-full">
              Edit Event
            </h3>
          </div>
          <div className="flex flex-col-reverse items-center md:flex-row md:justify-between">
            <div className="md:w-1/2 lg:w-1/3 me-5">
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
                              imagePreview !== null
                                ? "text-white"
                                : "text-gray-400"
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
                    name="category" // Make sure this matches your schema field name
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Select Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setCategory(value);
                            }} // Update the form state
                            value={field.value} // Controlled input
                          >
                            <SelectTrigger className="w-full dark:bg-transparent dark:border-gray-300 rounded dark:focus:outline-none">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className=" rounded dark:bg-[#4844b4] bg-[#4844b4]">
                              <SelectItem value="News">News</SelectItem>
                              <SelectItem value="Events">Events</SelectItem>
                              <SelectItem value="Updates">Updates</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {category === "event" && (
                    <>
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
                                          borderColor: "#d1d5db",
                                        },
                                        "&:hover fieldset": {
                                          borderColor: "#d1d5db",
                                        },
                                        "&.Mui-focused fieldset": {
                                          borderColor: "#d1d5db",
                                        },
                                      },
                                      "& .MuiInputBase-input": {
                                        color: "#d1d5db",
                                      },
                                      "& .MuiInputLabel-root": {
                                        color: "#d1d5db",
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
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-5">
                        <FormLabel>
                          {category === "event" ? "Event Date" : "Date"}
                        </FormLabel>
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
                                <span className="text-gray-400">
                                  Pick a date
                                </span>
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
            </div>
            <div className="w-full md:w-1/2">
              {imagePreview ? (
                <div className="relative w-full h-52 lg:w-3/4 lg:h-3/4 mx-auto">
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
        </>
      )}
    </ScrollArea>
  );
};

export default EditEvent;
