"use client";
import { TaskParam } from "@/types/task";
import React from "react";

interface BrowserInstanceParamProps {
  param: TaskParam;
  updateNodeParamValue: (value: string) => void;
  value: string;
}

const BrowserInstanceParam = ({ param }: BrowserInstanceParamProps) => {
  return <p className="text-xs">{param.name}</p>;
};

export default BrowserInstanceParam;
