// src/components/TodoItem.jsx

import React, { useState, useEffect } from 'react';
import { classNames, getPriorityMeta } from '../utils/helpers';

export default function TodoItem({ task, onToggle, onDelete, onTogglePin, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  useEffect(() => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  }, [task.id]);

  const priorityMeta = getPriorityMeta(task.priority);
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  function handleSaveEdit() {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) return;
    onUpdate(task.id, {
      title: trimmedTitle,
      description: editDescription.trim(),
    });
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    // Save on Enter (without Shift) or cancel on Escape
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
      setEditDescription(task.description || '');
    }
  }

  return (
    <article
      className={classNames(
        'group relative flex gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors',
        task.completed
          ? 'border-emerald-500/20 bg-slate-900/80'
          : 'border-slate-800/80 bg-slate-900/95 hover:border-slate-600/80'
      )}
    >
      {/* Checkbox */}
      <div className="flex items-start pt-0.5">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={classNames(
            'mt-0.5 h-4 w-4 rounded border flex items-center justify-center text-[10px] transition-colors',
            task.completed
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-50'
              : 'border-slate-600 bg-slate-950 text-transparent group-hover:border-brand-400'
          )}
          aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
        >
          ✓
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {/* Title and Action Buttons */}
        <div className="flex items-start gap-2">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
            />
          ) : (
            <h3
              onDoubleClick={() => setIsEditing(true)}
              className={classNames(
                'font-medium text-slate-50 truncate',
                task.completed && 'line-through text-slate-500'
              )}
            >
              {task.title}
            </h3>
          )}
          
          <div className="flex items-center gap-1 shrink-0">
            {/* Pin Button */}
            <button
              type="button"
              onClick={() => onTogglePin(task.id)}
              className={classNames(
                'h-6 w-6 flex items-center justify-center rounded-full border text-[11px] transition',
                task.pinned
                  ? 'border-amber-400/70 bg-amber-500/15 text-amber-200'
                  : 'border-slate-700/80 bg-slate-900/80 text-slate-400 hover:border-amber-400/70 hover:text-amber-200'
              )}
              title={task.pinned ? 'Unpin task' : 'Pin task'}
            >
              ★
            </button>
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              className="h-6 w-6 flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-[11px] text-slate-400 hover:border-brand-400 hover:text-brand-200 transition"
              title={isEditing ? 'Cancel edit' : 'Edit task'}
            >
              {isEditing ? '✕' : '✎'}
            </button>
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="h-6 w-6 flex items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-[11px] text-slate-500 hover:border-rose-500/80 hover:bg-rose-500/15 hover:text-rose-200 transition"
              title="Delete task"
            >
              🗑
            </button>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          {/* Priority Badge */}
          <span
            className={classNames(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5',
              priorityMeta.color
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {priorityMeta.label}
          </span>
          {/* Due Date Badge */}
          {task.dueDate && (
            <span
              className={classNames(
                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5',
                isOverdue
                  ? 'border-rose-500/60 bg-rose-500/10 text-rose-200'
                  : 'border-slate-700/80 bg-slate-900/80 text-slate-300'
              )}
            >
              <span>Due</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              {isOverdue && <span className="text-rose-300">• overdue</span>}
            </span>
          )}
          {/* Creation Date Badge */}
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-2 py-0.5">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {/* Tags */}
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Description / Edit Area */}
        {isEditing ? (
          <>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Update task details... (Enter to save, Esc to cancel)"
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40 resize-none"
            />
            <div className="mt-2 flex gap-2 text-[11px]">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-md bg-brand-500 px-2.5 py-1 font-medium text-slate-50 hover:bg-brand-600 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditDescription(task.description || '');
                }}
                className="rounded-md border border-slate-600 bg-slate-900 px-2.5 py-1 font-medium text-slate-300 hover:border-slate-400 transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          task.description && (
            <p className="mt-1 text-xs text-slate-300 whitespace-pre-line">
              {task.description}
            </p>
          )
        )}
      </div>
    </article>
  );
}