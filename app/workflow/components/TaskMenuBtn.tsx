import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import React from "react";

interface TaskMenuBtnProps {
  taskType: TaskType;
}

const TaskMenuBtn = ({ taskType }: TaskMenuBtnProps) => {
  const Task = TaskRegistry[taskType];

  const onDragStart = (ev: React.DragEvent, type: TaskType) => {
    ev.dataTransfer.setData("application/reactflow", type);
    ev.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      draggable
      onDragStart={(ev) => onDragStart(ev, taskType)}
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
