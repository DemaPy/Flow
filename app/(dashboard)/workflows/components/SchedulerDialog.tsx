"use client";

import updateWorkflowCron from "@/actions/workflows/updateWorkflowCron";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import cronparser from "cron-parser";

function SchedulerDialog({
  workflowId,
  cronValue,
}: {
  cronValue: string | null;
  workflowId: string;
}) {
  const [cron, setCron] = useState(cronValue || "");
  const [isValid, setValid] = useState(false);
  const [readCron, setReadCron] = useState("");
  const { isPending, mutate } = useMutation({
    mutationFn: () => updateWorkflowCron({ cron, id: workflowId }),
    onSuccess: () => {
      toast.success("Schedule updated", { id: "cron" });
    },
    onError: () => {
      toast.error("Schedule went wrong", { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      cronparser.parseExpression(cron);
      const humanCronString = cronstrue.toString(cron);
      setValid(true);
      setReadCron(humanCronString);
    } catch (error) {
      setValid(false);
    }
  }, [cron]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            cronValue && "text-primary"
          )}
          size={"sm"}
        >
          {cronValue && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readCron || "Loading..."}
            </div>
          )}
          {!cronValue && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title={<>Schedule workflow execution</>}
          icon={<CalendarIcon />}
        />
        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            Specify a cron expression to schedule periodic workflow execution.
            All times are in UTC.
          </p>
          <Input
            value={cron}
            onChange={(ev) => setCron(ev.target.value)}
            placeholder="E.g. * * * * *"
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive",
              isValid && "border-primary text-primary"
            )}
          >
            {isValid ? readCron : "Cron is not valid"}
          </div>
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button
              disabled={isPending}
              className="w-full"
              variant={"secondary"}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={isPending || !isValid}
              className="w-full"
              onClick={() => {
                toast.loading("Saving", { id: "cron" });
                mutate();
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SchedulerDialog;
