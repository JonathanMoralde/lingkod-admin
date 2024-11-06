"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";
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
import { HouseholdDetail, HouseholdMember } from "../../../columns";

type Props = { params: { id: string } };

const householdSchema = z.object({
  members: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      age: z.number().min(1, "Age is required"),
    })
  ),
});

type FormSchema = z.infer<typeof householdSchema>;

const EditMembers = ({ params }: Props) => {
  const { id } = params;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      members: [{ name: "", age: 0 }], // Initial empty member
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members", // Points to the 'members' array in the schema
  });

  useEffect(() => {
    const fetchHouseholdData = async () => {
      setIsFetching(true);
      try {
        const docRef = doc(db, "household_registrations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as HouseholdDetail;
          const members: HouseholdMember[] = data.members ?? [];

          // Update form with existing members
          form.setValue("members", members);
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

      // Update Firestore with new/updated members
      await updateDoc(docRef, {
        number_of_members: formData.members.length.toString(),
        members: formData.members,
      });

      toast.success("Household members updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating household members", error);
      toast.error("Failed to update household members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 bg-indigo-950 rounded-xl min-h-[80vh] w-full">
      {isFetching ? (
        <div className="w-full h-full grid place-items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center mb-10">
            <Button variant="ghost" size="icon" className="justify-start">
              <Link href="/lingkod/household">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-lg md:text-xl font-semibold w-full">
              Edit household members
            </h3>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="md:3/4 lg:w-1/2"
            >
              {/* Dynamic members fields */}
              {fields.map((member, index) => (
                <div key={member.id} className="flex gap-4 mb-4">
                  <FormField
                    name={`members.${index}.name`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            placeholder="Enter Name"
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            form.formState.errors.members?.[index]?.name
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`members.${index}.age`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="Enter Age"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            className="rounded"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.members?.[index]?.age?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Option to remove member */}
                  <Button
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="mt-6"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              {/* Button to add a new member */}
              <Button
                type="button"
                onClick={() => append({ name: "", age: 0 })}
                className="mt-4"
              >
                <PlusCircle className="mr-2" />
                Add Member
              </Button>

              <div className="grid place-items-center mt-6">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-white rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/2"
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

export default EditMembers;
