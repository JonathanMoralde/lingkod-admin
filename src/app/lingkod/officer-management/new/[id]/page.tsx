"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { db } from "@/config/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";

const formSchema = z.object({
  first_name: z.string(),
  middle_name: z.string(),
  last_name: z.string(),
  position: z.string(),
  gender: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = { params: { id: string } };

const EditOfficer = (props: Props) => {
  const { id }: { id: string } = props.params;
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [position, setPosition] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setIsFetching(true);
        const userRef = query(collection(db, "users"), where("uid", "==", id));
        const userSnapshot = await getDocs(userRef);

        const doc = userSnapshot.docs[0];

        const docData = doc.data();

        const userData = {
          id,
          joined_full_name: docData.joined_full_name,
          joined_full_name_lowercase: docData.joined_full_name_lowercase,
          email: docData.email,
          first_name: docData.first_name,
          middle_name: docData.middle_name,
          last_name: docData.last_name,
          gender: docData.gender,
          position: docData.position,
        };

        // Set the form values using the fetched event data
        form.setValue("first_name", userData.first_name);
        form.setValue("middle_name", userData.middle_name);
        form.setValue("last_name", userData.last_name);
        form.setValue("gender", userData.gender);
        form.setValue("position", userData.position);
        setPosition(userData.position);
        setGender(userData.gender);
      } catch (error) {
        console.log("An error occured while fetching user data", error);
        toast.error("An error occured while fetching user data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDetail();
  }, [id, form]);

  const onSubmit: SubmitHandler<FormSchema> = async (
    data: z.infer<typeof formSchema>
  ) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", id);

      const eventData: any = {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        joined_full_name: `${data.first_name} ${data.middle_name.charAt(0)}. ${
          data.last_name
        }`,
        position: data.position,
        gender: data.gender,
      };

      await updateDoc(userDocRef, eventData);

      toast.success("Officer details was edited successfully!");
      form.reset({
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        gender: "",
      });
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to edit officer. ${error.message}`);
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
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="py-10">
            <div className="flex items-center  mb-4">
              <Button variant="ghost" size="icon" className=" justify-start">
                <Link href="/lingkod/officer-management">
                  <ArrowLeft />
                </Link>
              </Button>

              <h3 className="text-lg md:text-xl font-semibold w-full">
                Edit Officer
              </h3>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-4 md:gap-16 mb-10">
                  <div className="md:w-1/2 space-y-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
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
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter middle name"
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
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter last name"
                              {...field}
                              className="placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:w-1/2 space-y-4">
                    <FormField
                      control={form.control}
                      name="position" // Make sure this matches your schema field name
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Position</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setPosition(value);
                              }} // Update the form state
                              value={field.value} // Controlled input
                            >
                              <SelectTrigger
                                className={`w-full dark:bg-transparent dark:border-gray-300 rounded dark:focus:outline-none ${
                                  !position ? "text-gray-400" : "text-white"
                                }`}
                              >
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent className=" rounded dark:bg-[#4844b4] bg-[#4844b4]">
                                <SelectItem value="Captain">
                                  Barangay Captain
                                </SelectItem>
                                <SelectItem value="Secretary">
                                  Barangay Secretary
                                </SelectItem>
                                <SelectItem value="Treasurer">
                                  Barangay Treasurer
                                </SelectItem>
                                <SelectItem value="Councilor">
                                  Barangay Councilor
                                </SelectItem>
                                <SelectItem value="Health Worker">
                                  Barangay Health Worker
                                </SelectItem>
                                <SelectItem value="Tanod">
                                  Barangay Tanod
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender" // Make sure this matches your schema field name
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Gender</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setGender(value);
                              }} // Update the form state
                              value={field.value} // Controlled input
                            >
                              <SelectTrigger
                                className={`w-full dark:bg-transparent dark:border-gray-300 rounded dark:focus:outline-none ${
                                  !gender ? "text-gray-400" : "text-white"
                                }`}
                              >
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent className=" rounded dark:bg-[#4844b4] bg-[#4844b4]">
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Undefined">
                                  Rather not say
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid place-items-center">
                  <Button
                    type="submit"
                    variant="default"
                    className="bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/2 md:w-1/4"
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
        </>
      )}
    </ScrollArea>
  );
};

export default EditOfficer;
