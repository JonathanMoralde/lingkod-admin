"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { loginSchema } from "@/models/loginSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      router.push("/lingkod/dashboard");
    }
  }, [user, router]);

  // Integrate React Hook Form with Zod validation
  const form = useForm<z.output<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("User signed in successfully!");
      setIsLoading(false);
      router.push("/lingkod/dashboard"); // Change to your desired route
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to sign in. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
      setIsLoading(false);
    }
  };

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return user ? (
    <main className="grid place-items-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin" />
    </main>
  ) : (
    <main className="relative overflow-hidden bg-indigo-900 min-h-screen">
      <div className="absolute rotate-12 top-[-35rem] left-[-26rem] md:top-[-35rem] md:left-[-30rem]">
        <div className="relative w-[60rem] h-[60rem] md:w-[81.25rem] md:h-[81.25rem]">
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
        className="absolute rotate-12 bottom-[-30rem] right-[-25rem] md:bottom-[-45rem] md:right-[-30rem] 
      "
      >
        <div className="relative w-[60rem] h-[60rem] md:w-[81.25rem] md:h-[81.25rem]">
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

      <section className="h-screen flex items-center w-full my-auto max-w-screen-lg mx-auto relative px-4 md:px-0">
        <div className="flex flex-col lg:flex-row lg:justify-between items-center h-auto lg:h-3/4 w-full md:w-3/4 lg:w-5/6 mx-auto bg-[#4844B4] rounded-3xl border-2 border-white shadow-lg">
          {/* logo */}
          <div className="bg-white h-auto py-5 lg:py-0  lg:h-full w-full lg:w-1/2 rounded-2xl flex flex-col justify-center items-center">
            <Carousel
              className="w-full"
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                <CarouselItem className="p-4 lg:p-0 grid place-items-center">
                  <div className="relative w-[8rem] lg:w-[18.75rem] h-[8rem] lg:h-[18.75rem] md:w-[12rem] md:h-[12rem] lg:mb-10 rounded-full shadow-lg">
                    <Image
                      src="/linkod_logo.png"
                      alt="Lingkod Logo"
                      fill
                      sizes="w-auto h-auto"
                      priority
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="p-5 lg:p-0 grid place-items-center">
                  <div className="relative w-[8rem] lg:w-[18.75rem] h-[8rem] lg:h-[18.75rem] md:w-[12rem] md:h-[12rem] lg:mb-10 rounded-full shadow-lg">
                    <Image
                      src="/28d74124c3365e8a66a995661eaa8724.png"
                      alt="Lingkod Logo"
                      fill
                      sizes="w-auto h-auto"
                      priority
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
            <h1 className="scroll-m-20 text-base md:text-lg lg:text-2xl font-bold tracking-wide uppercase text-indigo-900">
              Serving Local Communities
            </h1>
          </div>
          {/* login form */}

          <div className="h-auto w-full md:w-3/4 lg:w-1/2 px-4 py-6 md:py-10 lg:px-10   lg:h-full rounded-2xl grid place-items-center">
            <div className="w-full my-auto">
              <h3 className="text-white scroll-m-20 text-lg md:text-2xl font-semibold tracking-tight mb-2 md:mb-4 lg:mb-8 text-center">
                Welcome back, Admin!
              </h3>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="text-sm md:text-base"
                >
                  {/* email */}
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="mb-2 md:mb-4">
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

                  {/* password */}
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="mb-4 md:mb-10">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            className="text-white rounded"
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* forgot pass */}
                  <p className="leading-7 text-white text-right mb-4 md:mb-10">
                    <Link href="/forgotPassword">Forgot Password</Link>
                  </p>

                  {/* login btn */}
                  <div className="flex justify-center items-center w-full">
                    <Button
                      type="submit"
                      className="bg-white rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950 w-1/2 text-xs md:text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ?? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      LOGIN
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
