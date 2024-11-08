"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

const formSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  middle_name: z.string().min(1, "Event title is required"),
  last_name: z.string().min(1, "Event title is required"),
  zone: z.string().min(1, "Description is required"),
  email: z.string(),
  age: z.number(),
  birthday: z.date({
    required_error: "Date is required",
  }),
  civil_status: z.string(),
  gender: z.string(),
  contact_number: z.string(),
});

type Props = { params: { id: string } };

type FormData = z.infer<typeof formSchema>;

const EditUser = (props: Props) => {
  const { id }: { id: string } = props.params;

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [birthday, setBirthday] = React.useState<Date>();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setIsFetching(true);
        // Fetch user data
        const userRef = query(collection(db, "users"), where("uid", "==", id));
        const userSnapshot = await getDocs(userRef);

        const doc = userSnapshot.docs[0];

        const docData = doc.data();

        const userData = {
          id: doc.id,
          full_name: docData.joined_full_name, // Omit 'id' from the User type to avoid conflicts
          zone: docData.zone,
          email: docData.email,
          status: docData.status,
          age: docData.age,
          birthday: docData.birthday,
          block: docData.block,
          civil_status: docData.civil_status,
          contact_number: docData.contact_number,
          first_name: docData.first_name,
          middle_name: docData.middle_name,
          last_name: docData.last_name,
          lot: docData.lot,
          gender: docData.gender,
          profile_pic: docData.profile_pic ?? "",
          sector: docData.sector,
          valid_id: docData.valid_id,
        };

        // Set the form values using the fetched event data
        form.setValue("first_name", userData.first_name);
        form.setValue("middle_name", userData.middle_name);
        form.setValue("last_name", userData.last_name);
        form.setValue("zone", userData.zone);
        form.setValue("email", userData.email);
        form.setValue("age", userData.age);
        form.setValue("birthday", new Date(userData.birthday));
        form.setValue("civil_status", userData.civil_status);
        form.setValue("gender", userData.gender);
        form.setValue("contact_number", userData.contact_number);
        setBirthday(new Date(userData.birthday));
      } catch (error) {
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDetail();
  }, [id, form]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormData> = async (
    data: z.infer<typeof formSchema>
  ) => {
    setLoading(true);
    try {
      const documentRef = doc(collection(db, "users"), id);

      const eventData: any = {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        joined_full_name: `${data.first_name} ${data.middle_name} ${data.last_name}`,
        joined_full_name_lowercase: `${data.first_name.toLocaleLowerCase()} ${data.middle_name.toLocaleLowerCase()} ${data.last_name.toLocaleLowerCase()}`,
        zone: data.zone,
        email: data.email,
        age: data.age,
        birthday: format(data.birthday, "MMMM dd, yyyy"),
        civil_status: data.civil_status,
        gender: data.gender,
        contact_number: data.contact_number,
      };

      await updateDoc(documentRef, eventData);
      toast.success("User was updated successfully!");
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to edit user. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4  min-h-[80vh]">
      {isFetching ? (
        <div className="w-full h-[80vh] grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="py-10">
          <div className="flex items-center  mb-10">
            <Button variant="ghost" size="icon" className=" justify-start">
              <Link href="/lingkod/residents">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-lg md:text-xl font-semibold w-full">
              Edit User Details
            </h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex md:gap-16 mb-6 flex-col md:flex-row">
                <div className="md:w-1/2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Middle Name"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Age"
                            value={field.value || ""} // Ensure it's an empty string if undefined
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            } // Convert to number on change
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birthday</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal rounded",
                                  !birthday && "text-muted-foreground"
                                )}
                              >
                                {birthday
                                  ? format(birthday, "PPP")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={birthday}
                                onSelect={setBirthday}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:w-1/2">
                  <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Zone"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="civil_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Civil Status</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Civil Status"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Gender"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact Number"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid place-items-center md:w-1/2 mx-auto">
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
      )}
    </ScrollArea>
  );
};

export default EditUser;
