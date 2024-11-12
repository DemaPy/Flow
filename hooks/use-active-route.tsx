import { ROUTES } from "@/constance/routes";
import { usePathname } from "next/navigation";

const useActiveRoute = () => {
  const pathName = usePathname();
  const activeRoute =
    ROUTES.find(
      (route) => route.href.length > 1 && pathName.includes(route.href)
    ) || ROUTES[0];
  return activeRoute;
};

export default useActiveRoute;
