import React, { ReactElement } from "react";

interface ExecutionViewerLabelProps {
  icon: ReactElement;
  label: string;
  value: string | ReactElement | number
}

const ExecutionViewerLabel = ({
  icon,
  label,
  value,
}: ExecutionViewerLabelProps) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
};

export default ExecutionViewerLabel;
