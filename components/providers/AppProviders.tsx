"use client";
import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};

export default AppProviders;
