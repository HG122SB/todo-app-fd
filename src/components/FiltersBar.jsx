// src/components/FiltersBar.jsx

import React from 'react';
import { STATUS_FILTERS, SORT_OPTIONS, PRIORITY_OPTIONS } from '../constants';
import { classNames } from '../utils/helpers';

export default function FiltersBar({
  statusFilter, setStatusFilter,
  sortBy, setSortBy,
  search, setSearch,
  priorityFilter, setPriorityFilter,
  availableTags, activeTag, setActiveTag,
}) {
  return (
    <section className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={classNames(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-brand-500/80 bg-brand-500/15 text-brand-100'
                  : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500'
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Right Side: Priority, Sort, Tags, Search */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
        {/* Selects */}
        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          >
            <option value="all">All priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Tags and Search */}
        <div className="flex flex-wrap gap-2">
          {availableTags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Tags:</span>
              {/* 'Any' button for resetting tag filter */}
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={classNames(
                  'rounded-full border px-2 py-0.5 text-[11px] transition',
                  activeTag === null
                    ? 'border-brand-500/70 bg-brand-500/20 text-brand-100'
                    : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500'
                )}
              >
                Any
              </button>
              {/* Top Tags */}
              {availableTags.slice(0, 4).map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(isActive ? null : tag)}
                    className={classNames(
                      'rounded-full border px-2 py-0.5 text-[11px] transition',
                      isActive
                        ? 'border-brand-500/80 bg-brand-500/20 text-brand-100'
                        : 'border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-slate-500'
                    )}
                  >
                    #{tag}
                  </button>
                );
              })}
              {availableTags.length > 4 && (
                <span className="text-[10px] text-slate-500">
                  +{availableTags.length - 4}
                </span>
              )}
            </div>
          )}
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-slate-500">
              {/* Search Icon (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 pl-7 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}