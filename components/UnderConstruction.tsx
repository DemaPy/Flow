import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const UnderConstruction = () => {
  return (
    <div className="h-screen flex items-center justify-center gap-4 flex-col">
      <h2 className="font-bold text-xl">Under Construction</h2>
      <p className="text-muted-foreground text-sm text-center">
        Sorry, we are already working on it! Try again later
      </p>
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "icon",
        })}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default UnderConstruction;
