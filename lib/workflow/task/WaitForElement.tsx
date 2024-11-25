import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon, LucideProps, MousePointer } from "lucide-react";

export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for element",
  icon: (props: LucideProps) => (
    <EyeIcon className="stroke-amber-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Wep page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Visibility",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        {
          label: "Visible",
          value: "visible",
        },
        {
          label: "Hidden",
          value: "hidden",
        },
      ],
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
