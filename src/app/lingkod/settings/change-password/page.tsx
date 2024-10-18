"use client";

import { Loader2 } from "lucide-react";
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

// import { CurrentAdmin, getCurrentAdminData, handleEdit } from "../actions";

import { useAuth } from "../../../context/AuthContext";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    newPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

type FormSchema = z.infer<typeof formSchema>;

const ChangePassword = () => {
  const { user } = useAuth();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormSchema> = async (
    data: z.infer<typeof formSchema>
  ) => {
    setLoading(true);
    try {
      // console.log(user);
      const credential = EmailAuthProvider.credential(
        user!.email!,
        data.oldPassword
      );
      // Reauthenticate the user
      await reauthenticateWithCredential(user!, credential);
      // Update the user's password
      await updatePassword(user!, data.newPassword);
      toast.success("Password was updated successfully!");
      form.reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        toast.error(`Failed to update password. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold w-full ">Change Password</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 ">
          <div className="space-y-4 mb-10">
            <FormField
              name="oldPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-white rounded placeholder:text-gray-400 "
                      type="password"
                      placeholder="Enter your old password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-white rounded placeholder:text-gray-400 "
                      type="password"
                      placeholder="Enter your new password"
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
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-white rounded placeholder:text-gray-400 "
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid place-items-center">
            <Button
              type="submit"
              variant="default"
              className={`bg-white  rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 me-5 w-1/4`}
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
    </ScrollArea>
  );
};

export default ChangePassword;
