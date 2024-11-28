import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen w-full flex- flex-col items-center gap-4 justify-center">
      <Logo iconSize={50} fontSize="text-3xl" />
      <Separator className="max-w-xs" />
      <div className="flex items-center gap-2 justify-center">
        <Loader2Icon size={16} className="animate-spin stroke-primary" />
        <p>Setting up your account</p>
      </div>
    </div>
  );
};

export default loading;