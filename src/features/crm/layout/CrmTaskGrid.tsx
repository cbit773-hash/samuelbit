import type { ReactNode } from 'react';

export interface CrmTaskItem {
  id: string;
  icon: ReactNode;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

interface CrmTaskGridProps {
  tasks: CrmTaskItem[];
  activeTask: string;
  onTaskChange: (taskId: string) => void;
  title?: string;
}

export function CrmTaskGrid({ tasks, activeTask, onTaskChange, title = 'Arsenal de Ventas' }: CrmTaskGridProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            role="button"
            tabIndex={0}
            onClick={() => onTaskChange(task.id)}
            onKeyDown={(e) => e.key === 'Enter' && onTaskChange(task.id)}
            className={`border rounded-xl p-4 transition-all cursor-pointer group ${
              activeTask === task.id ? 'bg-white/10 border-cyan-500/50' : 'bg-surface-alt border-border hover:bg-surface-inset'
            } ${task.color}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${task.bg} ${task.color}`}>
              {task.icon}
            </div>
            <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider">{task.title}</h3>
            <p className="text-[10px] text-muted leading-tight">{task.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
