"use client"
import React, { PropsWithChildren } from "react";

interface NodeOutputsProps extends PropsWithChildren {}

const NodeOutputs = ({ children }: NodeOutputsProps) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
};

export default NodeOutputs;
