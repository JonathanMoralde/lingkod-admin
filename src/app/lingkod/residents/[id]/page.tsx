import React from "react";
import { getUserData, UserDetails, handleApprove } from "../actions";
import { format } from "date-fns";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ApproveBtn from "./approveBtn";
import RejectBtn from "./rejectBtn";

type Props = { params: { id: string } };

const ResidentDetail = async (props: Props) => {
  const { id }: { id: string } = props.params;

  const data: UserDetails = await getUserData(id);

  return (
    <ScrollArea className="bg-indigo-950 rounded-xl px-4 py-10 h-[80vh]">
      <div className="flex items-center  mb-10">
        <Button variant="ghost" size="icon">
          <Link href="/lingkod/residents">
            <ArrowLeft />
          </Link>
        </Button>

        <h3 className="text-xl font-semibold text-center w-full">
          User Information
        </h3>
      </div>
      <div className="flex justify-center mb-10">
        {/* image & btn */}
        <div className="w-1/4 h-full me-4">
          <div className="relative mx-auto w-52 h-52 rounded-full overflow-hidden">
            <Image
              src={data.profile_pic}
              alt="Background Image"
              fill
              sizes="w-auto h-auto"
              priority
            />
          </div>
        </div>

        {/* details */}
        <div className="flex w-1/2 justify-between">
          <div>
            <p className="mb-4 font-light">
              <span className="font-semibold">First Name: </span>
              {data.first_name}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Middle Name: </span>
              {data.middle_name}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Last Name: </span>
              {data.last_name}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Birthday: </span>
              {format(new Date(data.birthday), "MMMM d, yyyy")}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Civil Status: </span>
              {data.civil_status}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Zone: </span>
              {data.zone}
            </p>
          </div>
          <div>
            <p className="mb-4 font-light">
              <span className="font-semibold">Age: </span>
              {data.age}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Gender: </span>
              {data.gender}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Email: </span>
              {data.email}
            </p>
            <p className="mb-4 font-light">
              <span className="font-semibold">Contact Number: </span>
              {data.contact_number}
            </p>
          </div>
        </div>
      </div>

      {data.status == "pending" && (
        <div className="w-full">
          <h3 className="text-xl font-semibold text-center w-full mb-10">
            Submitted ID
          </h3>
          {/* <div> */}
          <div className="relative mx-auto w-[600px] h-80 mb-10">
            {/* <AspectRatio ratio={16 / 9}> */}
            <Image
              src={data.valid_id}
              alt="Background Image"
              fill
              sizes="w-auto h-auto"
              objectFit="contain"
            />
            {/* </AspectRatio> */}
          </div>

          <div className="flex justify-center">
            <ApproveBtn id={data.id} />

            <RejectBtn id={data.id} />
          </div>
        </div>
      )}
    </ScrollArea>
  );
};

export default ResidentDetail;
