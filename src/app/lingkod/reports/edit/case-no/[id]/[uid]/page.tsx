"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
import { db } from "@/config/firebase";
import {
  collection,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

type Props = { params: { id: string; uid: string } };

const FormSchema = z.object({
  case_no: z.number(),
});

const EditCaseNo = (props: Props) => {
  const { id, uid }: { id: string; uid: string } = props.params;

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    data: z.infer<typeof FormSchema>
  ) => {
    setLoading(true);
    try {
      const documentRef = doc(db, "blotter_reports", id);
      await updateDoc(documentRef, { case_no: data.case_no });

      const notificationRef = collection(db, "notifications");
      const notificationData: any = {
        is_read: false,
        receiver_uid: uid,
        notif_msg: `Blotter report have been assigned with a case number: ${data.case_no}.`,
        type: "report",
        timestamp: serverTimestamp(),
      };

      await addDoc(notificationRef, notificationData);
      toast.success(`Successfully assigned a case number`);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to assigned a case number. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-indigo-950 rounded-xl px-4 py-10  h-[80vh]">
      <div className="flex items-center  mb-10">
        <Button variant="ghost" size="icon" className=" justify-start">
          <Link href="/lingkod/reports">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold w-full">Assign Case Number</h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="case_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case No.</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter case number"
                    value={field.value || ""} // Ensure it's an empty string if undefined
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number on change
                    className="rounded"
                  />
                </FormControl>
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

export default EditCaseNo;
