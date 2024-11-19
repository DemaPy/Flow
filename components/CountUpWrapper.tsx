import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

interface CountUpWrapperProps {
  value: number;
}

export const CountUpWrapper = ({ value }: CountUpWrapperProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "-";

  return <CountUp duration={0.5} preserveValue end={value} decimal="0" />;
};
