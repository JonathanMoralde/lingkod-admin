import React, { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  icon: ReactNode;
  description: string;
  data: number;
  route: string;
};

const ReportCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className=" rounded-xl dark:bg-[#4844B4] z-10 shadow-md hover:cursor-pointer"
      onClick={() => {
        router.push(`/lingkod/${props.route}`);
      }}
    >
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center ">
        <span className="w-1/2 ">{props.icon}</span>
        <p className="w-1/2 text-[2rem] md:text-[2.5rem] font-bold text-center">
          {props.data}
        </p>
      </CardContent>
      <CardFooter>
        <p className="font-light text-sm md:text-base">{props.description}</p>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
