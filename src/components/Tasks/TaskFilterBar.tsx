// components/TaskFilterBar.tsx
import { useState } from 'react';
import type { TaskFilters } from '../../services/taskService';

interface Props {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  hasFilters: boolean;
}

export default function TaskFilter({ filters, onChange, hasFilters }: Props) {
    const Statuses = ["All","To-do","In-progress","Done"]
    const handleStatusSelect = (value:string) => {
      const nextStatus = filters.status === value ? "All" : value;
      onChange({
        ...filters,
        status: nextStatus
      }); 
    }
    const Priorities = ["All","Low","Medium","High"]
    const handlePrioritySelect = (value:string) => {
      const nextPriority = filters.priority === value ? "All" : value;
      onChange({
        ...filters,
        priority: nextPriority
      }); 
    }
    return (
      <div className='flex flex-col gap-1'>
      <button 
      onClick={() => onChange({ status: 'All', priority: 'All', dueBefore: '' })} 
      className="md:hidden font-medium text-xs p-0 m-0 text-right text-slate-500 hover:text-secondary hover:underline">
      Clear All Filters
      </button>
      <div className='bg-secondary/5 rounded-md p-2 justify-between grid grid-cols-[1fr_1fr_0.75fr_0.25fr]'>
      <div className='flex flex-row items-center gap-2 text-sm'>
        <p className="font-medium uppercase text-xs">Status:</p>
        <div className='bg-secondary/25 p-1 rounded-sm flex items-center flex-row gap-2 text-xs'>
        {Statuses.map((item) => {
          const isActive = filters.status === item;
          return (
            <button
              key={item}
              onClick={() => handleStatusSelect(item)}
              className={`
                p-1 px-3 rounded-md cursor-pointer transition-colors
                ${isActive 
                  ? 'bg-secondary text-white' 
                  : 'hover:bg-secondary/50 hover:text-white'
                }
              `}
            >
              {item}
            </button>
          );
        })}
        </div>
      </div>
      <div className='flex flex-row items-center gap-2 text-sm'>
        <p className="font-medium uppercase text-xs">Priority:</p>
        <div className='bg-secondary/25 p-1 rounded-sm flex items-center flex-row gap-2 text-xs'>
        {Priorities.map((item) => {
          const isActive = filters.priority === item;
          return (
            <button
              key={item}
              onClick={() => handlePrioritySelect(item)}
              className={`
                p-1 px-3 rounded-md cursor-pointer transition-colors
                ${isActive 
                  ? 'bg-secondary text-white' 
                  : 'hover:bg-secondary/50 hover:text-white'
                }
              `}
            >
              {item}
            </button>
          );
        })}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
      <span className="font-medium uppercase text-xs">Due Before:</span>
      <div className="p-1 bg-secondary/25 rounded-sm">
      <input
          type="date"
          className="p-1 px-3 bg-transparent rounded-sm text-xs"
          value={filters.dueBefore ?? ''}
          onChange={(e) => onChange({ ...filters, dueBefore: e.target.value || undefined })}
      />
      </div>
      </div>
      <button 
      onClick={() => onChange({ status: 'All', priority: 'All', dueBefore: '' })} 
      disabled={!hasFilters}
      className="max-md:hidden font-medium text-xs pr-2 m-0 text-right text-slate-500 hover:text-secondary hover:underline disabled:text-slate-300 disabled:cursor-not-allowed disabled:no-underline">
      Clear All Filters
      </button>

    </div>
    </div>
    );
}