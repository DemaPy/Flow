import Logo from "@/components/Logo";
import ThemeModeToggle from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React, { PropsWithChildren } from "react";

function layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ThemeModeToggle />
      </footer>
    </div>
  );
}

export default layout;
