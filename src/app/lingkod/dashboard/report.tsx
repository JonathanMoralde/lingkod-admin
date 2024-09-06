import React, { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  icon: ReactNode;
  description: string;
  data: number;
};

const ReportCard = (props: Props) => {
  return (
    <Card className=" rounded-xl dark:bg-[#4844B4] z-10 shadow-md">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <span className="w-1/2">{props.icon}</span>
        <p className="w-1/2 text-center text-[2.5rem] font-bold">
          {props.data}
        </p>
      </CardContent>
      <CardFooter>
        <p className="font-light">{props.description}</p>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
