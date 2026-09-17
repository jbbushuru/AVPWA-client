import { Plus } from "lucide-react";
import ActionButton from "../components/Shared/Button";
import CreateTask from "../components/Tasks/CreateTask";
import { useEffect, useState } from 'react';
import { fetchTasks, TaskFilters } from '../services/taskService';
import { Task } from '../utils/dateBuckets';
import TaskFilter from '../components/Tasks/TaskFilterBar';
import TasksHeader from "../components/Tasks/TasksHeader";
import EmptyState from "../components/Tasks/EmptyState";
import ViewTasks from "../components/Tasks/View_Tasks";

const BUCKET_LABELS: Record<string, string> = {
  overdue: 'Overdue',
  today: 'Today',
  thisWeek: 'This Week',
  later: 'Later',
  noDueDate: 'No Due Date',
  done: 'Done',
};

export default function Tasks() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filters, setFilters] = useState<TaskFilters>({
        status:'All',
        priority:'All',
        dueBefore:''
    });
    const hasActiveFilters = filters.status !== 'All' || filters.priority !== 'All' || Boolean(filters.dueBefore);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchTasks(filters)
        .then(setTasks)
        .finally(() => setLoading(false));
    }, [filters, refreshKey]);

    return (
        <div className="flex flex-col gap-6"> 
            <div className="flex justify-between items-center max-md:hidden"> 
            <TasksHeader/>
            <ActionButton 
            text="Add Task"
            icon={Plus}
            bgColor='bg-primary'
            iconColor="text-white"
            textColor='text-white'
            onClick={() => setIsCreateModalOpen(true)}
            />  
            </div>          
            <TaskFilter filters={filters} onChange={setFilters} hasFilters={hasActiveFilters}/>
            {loading && <p>Loading...</p>}
            {!loading &&
            (<ViewTasks 
             tasks={tasks}
             loading={loading}
            />
            )}

            {!loading && tasks.length === 0 && <EmptyState variant={hasActiveFilters ? "found" : "none"}/>}

            {/* Mobile Buttons */}
            <div className="fixed bottom-20 right-6 flex justify-between items-center md:hidden ">
                <div className="flex flex-col gap-2">
                    <ActionButton
                        icon={Plus}
                        bgColor='bg-primary hover:opacity-60'
                        iconColor="text-white"
                        className="rounded-full! w-12 h-12 p-0! gap-0! flex items-center justify-center shadow-lg [&_svg]:w-5 [&_svg]:h-5"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>
            </div>
            <CreateTask 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    // Refetch tasks logic could go here later
                }}
            />
        </div>
    )
}