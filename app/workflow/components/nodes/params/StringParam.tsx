"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskParam } from "@/types/task";
import React, { useId, useState } from "react";

interface StringParamProps {
  param: TaskParam;
  updateNodeParamValue: (value: string) => void;
  value: string;
}

const StringParam = ({
  param,
  value,
  updateNodeParamValue,
}: StringParamProps) => {
  const id = useId();
  const [internalvalue, setInternalvalue] = useState(value);

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Input
        value={internalvalue}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
        onChange={(e) => setInternalvalue(e.target.value)}
        id={id}
        placeholder="Enter value here"
        type="text"
        className="text-xs"
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
