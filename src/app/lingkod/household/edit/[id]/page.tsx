"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Props = { params: { id: string } };

const householdSchema = z.object({
  household_head: z.string().min(1, "Household head is required"),
  address: z.string().min(1, "Address is required"),
  contact_no: z.string().min(11, "Contact number must be at least 11 digits"),
});

type FormSchema = z.infer<typeof householdSchema>;

const EditHousehold = ({ params }: Props) => {
  const { id } = params;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(householdSchema),
  });

  useEffect(() => {
    const fetchHouseholdData = async () => {
      setIsFetching(true);
      try {
        const docRef = doc(db, "household_registrations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Pre-fill the form fields
          form.setValue("household_head", data.household_head);
          form.setValue("address", data.address);
          form.setValue("contact_no", data.contact_number);
        } else {
          toast.error("No such household found!");
        }
      } catch (error) {
        console.error("Error fetching household data", error);
        toast.error("Failed to load household data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchHouseholdData();
  }, [id, form]);

  const onSubmit = async (formData: FormSchema) => {
    try {
      setLoading(true);
      const docRef = doc(db, "household_registrations", id);

      await updateDoc(docRef, {
        household_head: formData.household_head,
        address: formData.address,
        contact_number: formData.contact_no,
      });

      toast.success("Household details updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating household", error);
      toast.error("Failed to update household details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-indigo-950 rounded-xl h-[80vh] w-full">
      {isFetching ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center  mb-10">
            <Button variant="ghost" size="icon" className=" justify-start">
              <Link href="/lingkod/household">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-lg md:text-xl font-semibold w-full">
              Edit household details
            </h3>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="md:w-1/2 lg:w-1/3"
            >
              <FormField
                name="household_head"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Household Head</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter household head"
                        className="rounded"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.household_head?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter address"
                        className="rounded"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                name="contact_no"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter contact number"
                        className="rounded"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.contact_no?.message}
                    </FormMessage>
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
        </>
      )}
    </section>
  );
};

export default EditHousehold;
