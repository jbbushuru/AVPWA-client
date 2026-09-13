import { useState } from "react";
import { X } from "lucide-react";
import { createTask } from "../../services/taskService";

interface CreateTaskProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId?: string;
    onSuccess?: () => void;
}

export default function CreateTask({ isOpen, onClose, lessonId, onSuccess }: CreateTaskProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [recurrence, setRecurrence] = useState('none');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;
    const buildRecurrencePayload = (selected: string) => {
    if (selected === 'none' || !selected) {
        return { enabled: false };
    }
    return {
        enabled: true,
        frequency: selected, // 'Daily' | 'Weekly' | 'Monthly'
        interval: 1,
    };
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createTask({
                title,
                description,
                lessonId,
                priority,
                dueDate: dueDate || undefined,
                recurrence: buildRecurrencePayload(recurrence)
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Create Task</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Title</label>
                        <input 
                            required 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm"
                            placeholder="Task title..."
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm min-h-[80px]"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Priority</label>
                            <select 
                                value={priority} 
                                onChange={e => setPriority(e.target.value)}
                                className="border rounded-md px-3 py-2 text-sm bg-white"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Due Date</label>
                            <input 
                                type="date"
                                value={dueDate} 
                                onChange={e => setDueDate(e.target.value)}
                                className="border rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Recurrence</label>
                        <select 
                            value={recurrence} 
                            onChange={e => setRecurrence(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm bg-white"
                        >
                            <option value="none">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t gap-2 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !title}
                            className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}