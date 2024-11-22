"use client";

import unpublishButton from "@/actions/workflows/unpublishButton";
import { Button } from "@/components/ui/button";
import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type UnPublishButtonProps = {
  workflowId: Workflow["id"];
};

const UnPublishButton = ({ workflowId }: UnPublishButtonProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: unpublishButton,
    onSuccess() {
      toast.success("Workflow unpublished.", { id: workflowId });
    },
    onError() {
      toast.error("Something went wrong.", { id: workflowId });
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        toast.loading("Workflow is unpublishing...", { id: workflowId });
        mutate({
          workflowId,
        });
      }}
      variant={"outline"}
      className="flex items-center gap-2"
    >
      <DownloadIcon className="stroke-orange-400" size={16} />
      UnPublish
    </Button>
  );
};

export default UnPublishButton;
