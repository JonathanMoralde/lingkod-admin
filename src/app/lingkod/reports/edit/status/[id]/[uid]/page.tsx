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
  FormMessage,
} from "@/components/ui/form";
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
  collection,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

type Props = { params: { id: string; uid: string } };

const FormSchema = z.object({
  status: z.string(),
});

const EditStatus = (props: Props) => {
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
      await updateDoc(documentRef, { status: data.status });

      const notificationRef = collection(db, "notifications");
      const notificationData: any = {
        is_read: false,
        receiver_uid: uid,
        notif_msg: `Blotter report status is now ${data.status}.`,
        type: "report",
        timestamp: serverTimestamp(),
      };

      await addDoc(notificationRef, notificationData);

      toast.success(`Successfully updated the status`);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to update status. ${error.message}`);
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

        <h3 className="text-lg md:text-xl font-semibold w-full">
          Update Status
        </h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:w-1/2 lg:w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full dark:bg-transparent dark:border-gray-300 rounded dark:focus:outline-none">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-[#4844b4] bg-[#4844b4]">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="resolved">Resolved Issue</SelectItem>
                    <SelectItem value="filed to action">
                      Filed to action
                    </SelectItem>
                  </SelectContent>
                </Select>
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

export default EditStatus;
