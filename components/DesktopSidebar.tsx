"use client";

import React from "react";
import Logo from "./Logo";
import RoutesList from "./RoutesList";
import UserAvailableCredits from "./UserAvailableCredits";

const DesktopSidebar = () => {
  return (
    <div className="hidden relative md:block h-screen min-w-[280px] max-w-[280px] overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCredits />
      </div>
      <div className="flex flex-col gap-2 p-2">
        <RoutesList />
      </div>
    </div>
  );
};

export default DesktopSidebar;
