import React, { PropsWithChildren } from "react";

interface NodeInputsProps extends PropsWithChildren {}

const NodeInputs = ({ children }: NodeInputsProps) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
};

export default NodeInputs;
