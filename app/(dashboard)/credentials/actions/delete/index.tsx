"use client";

import deleteCredential from "@/actions/credentials/deleteCredential";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface DeleteCredentialDialogProps {
  credentialName: string;
  credentialId: Credential["id"];
}

const DeleteCredentialDialog = ({
  credentialName,
  credentialId,
}: DeleteCredentialDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted", { id: "delete-credential" });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Failed to delete credential", { id: "delete-credential" });
    },
  });

  const onSubmit = useCallback(() => {
    toast.loading("Deleting credential...", { id: "delete-credential" });
    mutate(credentialId);
  }, [mutate]);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setConfirmText("");
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to revover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                Enter <b className="select-none">{credentialName}</b> to
                confirm:
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
            disabled={confirmText !== credentialName || isPending}
            onClick={onSubmit}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCredentialDialog;
