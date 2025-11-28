// src/components/Header.jsx

import React from 'react';
import { classNames } from '../utils/helpers';

export default function Header({ onClearCompleted, hasCompleted, taskCount }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-gradient-to-r from-brand-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
          Advanced Todo Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Organize tasks, prioritize work, and stay on top of your day.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Task Count Badge */}
        <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
          Total tasks: <span className="font-semibold text-slate-100">{taskCount}</span>
        </div>
        {/* Clear Completed Button */}
        <button
          type="button"
          disabled={!hasCompleted}
          onClick={onClearCompleted}
          className={classNames(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            hasCompleted
              ? 'border-rose-500/60 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20'
              : 'border-slate-700/80 bg-slate-900/60 text-slate-500 cursor-not-allowed'
          )}
        >
          {/* Note: Assuming 'i-ph-trash-simple-duotone' is an icon utility class you have configured (e.g., with unplugin-icons) */}
          <span className="i-ph-trash-simple-duotone" aria-hidden="true" />
          Clear completed
        </button>
      </div>
    </header>
  );
}