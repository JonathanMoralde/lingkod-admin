import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const loading = (props: Props) => {
  return (
    <div className="grid place-items-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default loading;
