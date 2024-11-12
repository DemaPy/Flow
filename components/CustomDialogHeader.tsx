import React, { ReactElement, isValidElement } from "react";
import { DialogHeader, DialogTitle } from "./ui/dialog";

interface CustomDialogHeaderProps {
  icon?: React.ReactElement;
  title?: React.ReactElement;
  subtitle?: React.ReactElement;
}

const CustomDialogHeader = ({
  icon,
  subtitle,
  title,
}: CustomDialogHeaderProps) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {icon}
          {React.Children.map(title, (child) => {
            return <p className="text-xl text-primary">{child}</p>;
          })}
          {React.Children.map(subtitle, (child) => {
            return <p className="text-sm text-muted-foreground">{child}</p>;
          })}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
};

export default CustomDialogHeader;
