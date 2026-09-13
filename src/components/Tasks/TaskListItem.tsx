// components/TaskListItem.tsx
import type { Task } from '../../utils/dateBuckets';
import { completeTask, uncompleteTask, deleteTask, updateTask } from '../../services/taskService';

interface Props {
  task: Task;
  onUpdated: () => void; // trigger parent refetch after any mutation
  onEdit: (task: Task) => void;
}

const getPriorityColor= (priority:string|undefined) => {
    if (priority==='low') return '#8fbf8f';
    if (priority==='high') return '#d9695f';
    return '#e0b64f';
}
const formatDueDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export default function TaskListItem({ task, onUpdated, onEdit }: Props) {
  const isDone = task.status === 'Done';
  const priorityColor = getPriorityColor(task.priority);

  const handleToggleComplete = async () => {
    if (isDone) {
      await uncompleteTask(task._id);
    } else {
      await completeTask(task._id);
    }
    onUpdated();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    await deleteTask(task._id);
    onUpdated();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      borderRadius: '8px',
      borderLeft: `3px solid ${priorityColor}`,
      background: isDone ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.6)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      opacity: isDone ? 0.6 : 1,
      transition: 'opacity 0.2s, box-shadow 0.2s',
    }}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isDone}
        onChange={handleToggleComplete}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
        style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
      />

      {/* Main content — clickable for edit */}
      <div
        onClick={() => onEdit(task)}
        style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
      >
        <span style={{
          fontSize: '0.93rem',
          fontWeight: 500,
          textDecoration: isDone ? 'line-through' : 'none',
          color: isDone ? '#888' : 'inherit',
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {task.title}
        </span>

        {task.lessonId && typeof task.lessonId === 'object' && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#888',
            marginTop: '2px',
            display: 'block',
          }}>
            {task.lessonId.subject}
          </span>
        )}
      </div>

      {/* Due date */}
      {task.dueDate && (
        <span style={{
          fontSize: '0.75rem',
          color: '#888',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {formatDueDate(task.dueDate)}
        </span>
      )}

      {/* Recurring icon */}
      {task.recurrence?.enabled && (
        <span title="Recurring task" style={{ fontSize: '0.85rem', color: '#aaa', flexShrink: 0 }}>↻</span>
      )}

      {/* Status select */}
      <select
        value={task.status}
        onChange={async (e) => {
          await updateTask(task._id, { title: task.title, status: e.target.value } as any);
          onUpdated();
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontSize: '0.75rem',
          padding: '3px 6px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          background: 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <option value="To-do">To-do</option>
        <option value="In-progress">In progress</option>
        <option value="Done" disabled>Done</option>
      </select>

      {/* Delete */}
      <button
        onClick={handleDelete}
        aria-label="Delete task"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          color: '#bbb',
          padding: '2px 4px',
          borderRadius: '4px',
          flexShrink: 0,
          lineHeight: 1,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#d9695f')}
        onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}
      >
        🗑
      </button>
    </div>
  );
}