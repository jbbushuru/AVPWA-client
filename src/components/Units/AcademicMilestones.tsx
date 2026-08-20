import { BookOpen, X, Loader2 } from "lucide-react";
interface Milestone{
    icon: string;
    title: string;
    description: string;
}
const MilestoneCard = ({ milestone }: {milestone: Milestone}) => {
    return (
        <div
            className="flex items-center justify-between gap-3 rounded-xl dark:bg-[#262f45] px-4 py-3">
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm uppercase font-semibold text-[#101828] dark:text-white truncate">
                    {milestone.icon}
                </span>
                <span className="text-[10px] font-bold tracking widest  text-gray-500 dark:text-gray-400">
                    {milestone.title}
                    {milestone.description}
                </span>
            </div>
        </div>
    )
}

export default function AcademicMilestones() {
    return (
        <div className="bg-slate-100">
            <h1>Academic Milestones</h1>
        </div>
    )
}