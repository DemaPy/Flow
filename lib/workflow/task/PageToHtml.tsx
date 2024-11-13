import { TaskParamType, TaskType } from "@/types/task";
import { GlobeIcon, LucideProps } from "lucide-react";

export const PageToHtml = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get HTML from page",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Wep page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ],
};
