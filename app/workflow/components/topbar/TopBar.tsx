"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import { Workflow } from "@prisma/client";
import ExecuteBtn from "./ExecuteBtn";
import NavigationTabs from "./NavigationTabs";
import PublishButton from "./PublishButton";

interface TopBarProps {
  title: string;
  subtitle?: string;
  workflowId: Workflow["id"];
  hideButtons?: boolean;
  isPublished?: boolean;
}

const TopBar = ({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished
}: TopBarProps) => {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 z-10 bg-background">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              router.back();
            }}
          >
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      {!hideButtons && (
        <div className="flex gap-1 flex-1 justify-end">
          <ExecuteBtn workflowId={workflowId} />
          {!isPublished && (
            <>
              <PublishButton workflowId={workflowId} />
              <SaveBtn workflowId={workflowId} />
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;
