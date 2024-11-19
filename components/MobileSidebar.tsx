import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Logo from "./Logo";
import RoutesList from "./RoutesList";
import UserAvailableCredits from "./UserAvailableCredits";

const MobileSidebar = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-1">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size={"sm"} variant={"ghost"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:w-[540px] space-y-4" side="left">
            <Logo />
            <UserAvailableCredits />
            <div className="flex flex-col gap-1">
              <RoutesList setClose={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default MobileSidebar;
