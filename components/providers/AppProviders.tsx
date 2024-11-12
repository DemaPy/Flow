"use client";
import React, { PropsWithChildren, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
