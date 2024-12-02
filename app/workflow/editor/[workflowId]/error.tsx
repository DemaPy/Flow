"use client";

import { useEffect } from "react";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <p className="mb-2 mt-2 text-xs text-muted-foreground">{error.message}</p>
      <button
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary/80"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
};

export default Error;
