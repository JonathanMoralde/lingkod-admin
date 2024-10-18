"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const formSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/lingkod/dashboard");
    }
  }, [user, router]);

  // Integrate React Hook Form with Zod validation
  const form = useForm<z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset link was sent to your email");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to send password reset link. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <main className="relative overflow-hidden bg-indigo-900 min-h-screen">
      <div className="absolute rotate-12 top-[-35rem] left-[-30rem]">
        <div className="relative w-[81.25rem] h-[81.25rem]">
          <Image
            className=" "
            src="/1.svg"
            alt="Background Image"
            fill
            sizes="w-auto h-auto"
            priority
          />
        </div>
      </div>
      <div
        className="absolute rotate-12 bottom-[-45rem] right-[-30rem] 
      "
      >
        <div className="relative w-[81.25rem] h-[81.25rem]">
          <Image
            className=""
            src="/2.svg"
            alt="Background Image"
            fill
            priority
            sizes="w-auto h-auto"
          />
        </div>
      </div>

      <section className="h-screen flex items-center my-auto w-1/3 mx-auto relative">
        <div className="flex justify-between items-center h-1/2 w-full bg-[#4844B4] rounded-3xl border-white border-2 shadow-lg">
          {/* login form */}

          <div className="w-full px-10 py-20  h-full rounded-2xl relative">
            <Button
              variant="ghost"
              size="icon"
              className=" absolute top-4 left-4"
            >
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>

            <h3 className="text-white scroll-m-20 text-2xl font-semibold tracking-tight mb-8 text-center">
              Forgot Password
            </h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* email */}
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
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* login btn */}
                <div className="flex justify-center items-center w-full">
                  <Button
                    type="submit"
                    className="bg-white rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 w-1/2"
                  >
                    SUBMIT
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
