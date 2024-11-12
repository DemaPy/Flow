"use client";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";
import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

const routes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

const DesktopSidebar = () => {
  const pathName = usePathname();
  return (
    <div className="hidden relative md:block h-screen min-w-[280px] max-w-[280px] overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        TODO: Credits
      </div>
      <div className="flex flex-col gap-2 p-2">
        {routes.map((route) => (
          <Link
            className={buttonVariants({
              variant: pathName.includes(route.href)
                ? "sidebarActiveItem"
                : "sidebarItem",
            })}
            key={route.href}
            href={route.href}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DesktopSidebar;
