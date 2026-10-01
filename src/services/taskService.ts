import { api } from "./api";
import { Task } from "../utils/dateBuckets";

interface Recurrence {
  enabled: boolean;
  frequency?: string;
  interval?: number;
}
export interface TaskPayload {
  title: string;
  description?: string;
  lessonId?: string;
  priority?: string;
  dueDate?: string;
  recurrence?: Recurrence;
}

export const createTask = async (payload: TaskPayload) => {
  const response = await api.post('/tasks', payload);
  return response.data;
};

export interface TaskFilters {
    status?: string;
    priority?: string;
    dueBefore?: string;
    lessonId?: string;
}

// taskService.ts  L30-L42
export async function fetchTasks(filters: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
  if (filters.dueBefore) params.append('dueBefore', filters.dueBefore);

  const res = await api.get<Task[]>(`/tasks?${params.toString()}`);
  return res.data;
}


export const completeTask = async (id: string) => {
    const res = await api.patch(`/tasks/${id}/complete`);
    return res.data;
}

export const uncompleteTask = async (id: string) => {
    const res = await api.patch(`/tasks/${id}/uncomplete`);
    return res.data;
}

export const updateTask = async (id: string, payload: TaskPayload) => {
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data;
}

export const deleteTask = async (id: string) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
}

