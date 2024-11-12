import Logo from "@/components/Logo";
import React, { PropsWithChildren } from "react";

const layout = ({children}: PropsWithChildren) => {
  return <div className="gap-4 flex flex-col items-center justify-center h-screen">
    <Logo />
    {children}
  </div>;
};

export default layout;
