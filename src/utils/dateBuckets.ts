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
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - today.getDay()));

  const buckets: Record<Bucket, Task[]> = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
    noDueDate: [],
    done: [],
  };

  for (const task of tasks) {
    if (!task.dueDate) {
      buckets.noDueDate.push(task);
      continue;
    }

    const due = startOfDay(new Date(task.dueDate));

    if (due < today && task.status !== 'Done') {
      buckets.overdue.push(task);
    } else if (task.status !== 'Done') {
      if (due.getTime() === today.getTime()) {
        buckets.today.push(task);
      } else if (due <= endOfWeek) {
        buckets.thisWeek.push(task);
      } else {
        buckets.later.push(task);
      }
    }

    if (task.status === 'Done') {
      buckets.done.push(task);
    }
  }

  return buckets;
}