"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskParam } from "@/types/task";
import React, { useEffect, useId, useState } from "react";

interface StringParamProps {
  param: TaskParam;
  updateNodeParamValue: (value: string) => void;
  value: string;
  disabled: boolean;
}

const StringParam = ({
  param,
  value,
  disabled,
  updateNodeParamValue,
}: StringParamProps) => {
  const id = useId();
  const [internalvalue, setInternalvalue] = useState(value);

  useEffect(() => {
    setInternalvalue(value);
  }, [value]);

  let Component: any = Input;
  if (param?.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        disabled={disabled}
        value={internalvalue}
        onBlur={(
          e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => updateNodeParamValue(e.target.value)}
        onChange={(
          e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => setInternalvalue(e.target.value)}
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
