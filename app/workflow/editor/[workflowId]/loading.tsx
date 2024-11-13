import { Loader2Icon } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon className="animate-spin" size={30} />
    </div>
  );
}

export default loading;
