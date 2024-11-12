import { ROUTES } from "@/constance/routes";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import useActiveRoute from "@/hooks/use-active-route";

interface RoutesListProps {
  setClose?: () => void;
}

const RoutesList = ({ setClose }: RoutesListProps) => {
  const activeRoute = useActiveRoute();
  return (
    <>
      {ROUTES.map((route) => (
        <Link
          className={buttonVariants({
            variant:
              activeRoute.href === route.href
                ? "sidebarActiveItem"
                : "sidebarItem",
          })}
          key={route.href}
          href={route.href}
          onClick={setClose}
        >
          <route.icon size={20} />
          {route.label}
        </Link>
      ))}
    </>
  );
};

export default RoutesList;
