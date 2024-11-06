"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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

import { db, auth } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
const formSchema = z
  .object({
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    position: z.string(),
    gender: z.string(),
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

type FormSchema = z.infer<typeof formSchema>;

type Props = {};

const NewOfficer = (props: Props) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [position, setPosition] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormSchema> = async (
    data: z.infer<typeof formSchema>
  ) => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // insert the event details in the events collection
      const eventData: any = {
        uid: user.user.uid,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        position: data.position,
        gender: data.gender,
        joined_full_name: `${data.first_name} ${data.middle_name.charAt(0)}. ${
          data.last_name
        }`,
        joined_full_name_lowercase: `${
          data.first_name
        } ${data.middle_name.charAt(0)}. ${data.last_name}`.toLocaleLowerCase(),
        email: data.email,
        role: "admin",
        status: "active",
      };

      // Use setDoc to create a document with the user's uid as the document ID
      const userDocRef = doc(db, "users", user.user.uid);
      await setDoc(userDocRef, eventData);

      toast.success("Officer was added successfully!");
      form.reset({
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        gender: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to add new officer. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4  min-h-[80vh]">
      <div className="py-10">
        <div className="flex items-center  mb-4">
          <Button variant="ghost" size="icon" className=" justify-start">
            <Link href="/lingkod/officer-management">
              <ArrowLeft />
            </Link>
          </Button>

          <h3 className="text-lg md:text-xl font-semibold w-full">
            Add New Officer
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

              <div className="md:w-1/2 space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="text-white rounded"
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-10">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="text-white rounded"
                          type="password"
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mb-10">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          className="text-white rounded"
                          type="password"
                          placeholder="Enter password"
                          {...field}
                        />
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
    </ScrollArea>
  );
};

export default NewOfficer;
