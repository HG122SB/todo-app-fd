// src/components/TodoList.jsx

import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ tasks, ...handlers }) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-4 py-10 text-center text-sm text-slate-400">
        <p className="mb-1 font-medium text-slate-300">No tasks match the current filters 🎯</p>
        <p className="text-xs text-slate-500">
          Try adjusting your search query, status, or tag filters.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-3 space-y-2.5">
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} {...handlers} />
      ))}
    </section>
  );
}