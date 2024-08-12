import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-indigo-900 min-h-screen">
      <Image
        className="absolute rotate-12 top-[-35rem] left-[-30rem] "
        src="/1.svg"
        alt="Background Image"
        // layout="responsive"
        width={1300}
        height={1300}
        priority
      />
      <Image
        className="absolute rotate-12 bottom-[-45rem] right-[-30rem] "
        src="/2.svg"
        alt="Background Image"
        // layout="responsive"
        width={1300}
        height={1300}
        priority
      />

      <section className="h-screen flex items-center w-full my-auto max-w-screen-lg mx-auto relative">
        <div className="flex justify-between items-center h-3/4 w-full bg-[#4844B4] rounded-3xl border-4 border-white shadow-lg">
          {/* logo */}
          <div className="bg-white h-full w-1/2 rounded-2xl flex flex-col justify-center items-center">
            <div className="w-[300px] h-[300px] mb-10 rounded-full shadow-lg">
              <Image
                src="/logo-no-background 1.png"
                alt="Lingkod Logo"
                layout="responsive"
                width={300}
                height={300}
                priority
              />
            </div>
            <h1 className="scroll-m-20 text-2xl font-bold tracking-wide uppercase text-indigo-900">
              Serving Local Communities
            </h1>
          </div>
          {/* //bg-gradient-to-l from-indigo-800 to-indigo-700 */}
          {/* login form */}
          <div className="w-1/2 px-10 py-20  h-full rounded-2xl ">
            <h3 className="text-white scroll-m-20 text-2xl font-semibold tracking-tight mb-8 text-center">
              Welcome back, Admin!
            </h3>

            {/* email */}
            <div className="mb-4">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                className="text-white rounded"
                type="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>

            {/* password */}
            <div className="mb-4">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                className="text-white rounded"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            {/* forgot pass */}
            <p className="leading-7 text-white text-right mb-10">
              Forgot Password
            </p>

            {/* login btn */}

            <div className="flex justify-center items-center w-full">
              <Button
                className="bg-white rounded hover:bg-[#ffffffc6] shadow-lg font-semibold tracking-wide text-indigo-950"
                variant="default"
              >
                LOGIN
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
