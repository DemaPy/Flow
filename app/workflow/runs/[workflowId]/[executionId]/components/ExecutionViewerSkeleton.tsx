import { Loader2Icon } from "lucide-react";
import React from "react";

type Props = {};

const ExecutionViewerSkeleton = (props: Props) => {
  return (
    <div className="flex items-center justify-center w-full">
      <Loader2Icon size={26} className="animate-spin stroke-primary" />
    </div>
  );
};

export default ExecutionViewerSkeleton;
