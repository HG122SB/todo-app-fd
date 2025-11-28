// src/components/TodoInput.jsx

import React, { useState } from 'react';
import { PRIORITY_OPTIONS } from '../constants';
import { classNames, generateId } from '../utils/helpers';

export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const canSubmit = title.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    const now = new Date().toISOString();
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAdd({
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      tags: tagList,
      dueDate: dueDate || null,
      completed: false,
      createdAt: now,
      pinned: false,
    });

    // Reset form state
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTags('');
    setDueDate('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950/95 shadow-xl shadow-slate-950/60 p-4 sm:p-5 mb-6"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Title and Priority */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Task title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a clear, actionable title"
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
          <div className="sm:w-40">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Description <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Add helpful details, links, or acceptance criteria"
            className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 resize-none"
          />
        </div>
        {/* Tags, Due Date, and Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Tags <span className="text-slate-500 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, ui, personal"
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className={classNames(
              'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-md shadow-brand-900/40 transition disabled:cursor-not-allowed disabled:opacity-40',
              canSubmit
                ? 'bg-brand-500 hover:bg-brand-600 text-slate-50'
                : 'bg-slate-800 text-slate-400'
            )}
          >
            {/* Note: Assuming 'i-ph-plus-bold' is an icon utility class */}
            <span className="i-ph-plus-bold mr-1.5" aria-hidden="true" />
            Add task
          </button>
        </div>
      </div>
    </form>
  );
}