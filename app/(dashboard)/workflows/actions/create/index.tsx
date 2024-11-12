"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Layers2Icon } from "lucide-react";
import React, { useState } from "react";

interface CreateWorkFlowDialogProps {
  triggerText?: string;
}

const CreateWorkFlowDialog = ({ triggerText }: CreateWorkFlowDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={<Layers2Icon size={30} className="stroke-primary" />}
          title={<>Create workflow</>}
          subtitle={<>Start building your workflow</>}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkFlowDialog;
