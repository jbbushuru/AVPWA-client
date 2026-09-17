import { ClipboardList, ClipboardPlus, FileSearchCorner } from "lucide-react";
import ActionButton from "../Shared/Button";
import { useState } from "react";
import CreateTask from "./CreateTask";

const NoTasksYet = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    return (
        <>
        <div className="flex flex-col items-center justify-center gap-4 max-w-md self-center mt-16">
            <div className="flex items-center justify-center bg-primary/20 rounded-full p-6">
                <ClipboardList className="text-primary" size={60} />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold ">No Tasks Yet.</h1>
                <p className="text-center">You haven’t created any tasks yet. Start by creating your first task to see it here</p>
            </div>
            <ActionButton
            text="Create Your First Task"
            icon={ClipboardPlus}
            bgColor='bg-primary'
            iconColor="text-white"
            textColor='text-white'
            onClick={() => setIsCreateModalOpen(true)}
            />
        </div>
        <CreateTask 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
                // Refetch tasks logic could go here later
            }}
        />
        </>
    );
}
const NoTasksFound = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 max-w-md self-center mt-16">
        <div className="flex items-center justify-center bg-primary/20 rounded-full p-6">
            <FileSearchCorner className="text-primary" size={60} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-2xl font-bold ">No Tasks Found.</h1>
            <p className="text-center">We couldn’t find any tasks matching your current filters.</p>
        </div>
        </div>
    );
}

interface EmptyStateProps{
    variant: "none" | "found";
}

export default function EmptyState({ variant }: EmptyStateProps) {
    if (variant === "none") {
        return <NoTasksYet />;
    }
    if (variant === "found") {
        return <NoTasksFound />;
    }
}