import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import React from "react";

interface TaskMenuBtnProps {
  taskType: TaskType;
}

const TaskMenuBtn = ({ taskType }: TaskMenuBtnProps) => {
  const Task = TaskRegistry[taskType];
  return (
    <Button
      variant={"secondary"}
      className="flex justify-between items-center gap-2 border w-full"
    >
      <div className="flex gap-2">
        <Task.icon size={20} />
        {Task.label}
      </div>
    </Button>
  );
};

export default TaskMenuBtn;
