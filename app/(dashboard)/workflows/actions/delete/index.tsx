"use client";

import deleteWorkflow from "@/actions/workflows/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteWorkflowDialogProps {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
  workflowName: string;
  workflowId: Workflow["id"];
}

const DeleteWorkflowDialog = ({
  isOpen,
  setIsOpen,
  workflowName,
  workflowId,
}: DeleteWorkflowDialogProps) => {
  const [confirmText, setConfirmText] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted", { id: "delete-workflow" });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Failed to delete workflow", { id: "delete-workflow" });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Deleting workflow...", { id: "delete-workflow" });
    mutate(workflowId);
  }, [mutate]);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setConfirmText("");
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to revover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                Enter <b className="select-none">{workflowName}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
            disabled={confirmText !== workflowName || isPending}
            onClick={onSubmit}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkflowDialog;
