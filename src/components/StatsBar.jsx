// src/components/StatsBar.jsx

import React from 'react';

export default function StatsBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2">
        <p className="text-[11px] text-slate-400">Active</p>
        <p className="text-sm font-semibold text-slate-50">{active}</p>
      </div>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2">
        <p className="text-[11px] text-slate-400">Completed</p>
        <p className="text-sm font-semibold text-emerald-300">{completed}</p>
      </div>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2">
        <p className="text-[11px] text-slate-400">High priority</p>
        <p className="text-sm font-semibold text-rose-300">{highPriority}</p>
      </div>
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2">
        <p className="text-[11px] text-slate-400">Progress</p>
        <div className="mt-0.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-sky-500 to-emerald-400 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-200 min-w-[2.5rem] text-right">
            {completionRate}%
          </span>
        </div>
      </div>
    </section>
  );
}