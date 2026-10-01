// utils/dateBuckets.ts

interface Recurrence {
  enabled: boolean;
  frequency?: string;
  interval?: number;
}
export interface Task {
  _id: string;
  title: string;
  description?: string;
  lessonId?: {
    _id: string;
    subject: string;
    name: string;
  };
  priority?: string;
  dueDate?: string;
  recurrence?: Recurrence;
  status?: string;
}
export type Bucket = 'overdue' | 'today' | 'thisWeek' | 'later' | 'noDueDate' | 'done';

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export function bucketTasks(tasks: Task[]): Record<Bucket, Task[]> {
  const today = startOfDay(new Date());

  // Calculate Sunday as the end of the current week (23:59:59 or end of day)
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday...
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSunday);

  const buckets: Record<Bucket, Task[]> = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
    noDueDate: [],
    done: [],
  };

  for (const task of tasks) {
    // 1. Handled completed tasks first regardless of due date
    if (task.status === 'Done') {
      buckets.done.push(task);
      continue;
    }

    // 2. Handle tasks without a due date
    if (!task.dueDate) {
      buckets.noDueDate.push(task);
      continue;
    }

    const due = startOfDay(new Date(task.dueDate));

    // 3. Bucket active tasks by due date
    if (due < today) {
      buckets.overdue.push(task);
    } else if (due.getTime() === today.getTime()) {
      buckets.today.push(task);
    } else if (due <= endOfWeek) {
      buckets.thisWeek.push(task);
    } else {
      buckets.later.push(task);
    }
  }

  return buckets;
}