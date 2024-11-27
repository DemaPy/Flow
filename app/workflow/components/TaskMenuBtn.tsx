import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { CoinsIcon } from "lucide-react";
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
      <div className="flex items-center gap-2">
        <Task.icon size={20} />
        {Task.label}
      </div>
      <Badge variant={"outline"} className="flex gap-2 items-center">
        <CoinsIcon size={16} />
        {Task.credits}
      </Badge>
    </Button>
  );
};

export default TaskMenuBtn;
