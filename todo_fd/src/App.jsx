import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'advanced-react-todo-app-v1';
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  { value: 'high', label: 'High', color: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
];
const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];
const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Newest' },
  { value: 'created_asc', label: 'Oldest' },
  { value: 'due_asc', label: 'Due date ↑' },
  { value: 'due_desc', label: 'Due date ↓' },
  { value: 'priority_desc', label: 'Priority' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getPriorityMeta(priority) {
  return (
    PRIORITY_OPTIONS.find((p) => p.value === priority) || PRIORITY_OPTIONS[1]
  );
}

function loadInitialTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn('Failed to load tasks', e);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks', e);
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function Header({ onClearCompleted, hasCompleted, taskCount }) {
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
        <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
          Total tasks: <span className="font-semibold text-slate-100">{taskCount}</span>
        </div>
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
          <span className="i-ph-trash-simple-duotone" aria-hidden="true" />
          Clear completed
        </button>
      </div>
    </header>
  );
}

function TodoInput({ onAdd }) {
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Task title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a clear, actionable title"
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
          <div className="sm:w-40">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Due date
            </label>
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
            <span className="i-ph-plus-bold mr-1.5" aria-hidden="true" />
            Add task
          </button>
        </div>
      </div>
    </form>
  );
}

function FiltersBar({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  search,
  setSearch,
  priorityFilter,
  setPriorityFilter,
  availableTags,
  activeTag,
  setActiveTag,
}) {
  return (
    <section className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
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
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          >
            <option value="all">All priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Tags:</span>
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
          <div className="relative w-full sm:w-56">
            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
              >
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

function StatsBar({ tasks }) {
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

function TodoItem({ task, onToggle, onDelete, onTogglePin, onUpdate }) {
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
              className={classNames(
                'font-medium text-slate-50 truncate',
                task.completed && 'line-through text-slate-500'
              )}
            >
              {task.title}
            </h3>
          )}
          <div className="flex items-center gap-1 shrink-0">
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
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              className="h-6 w-6 flex items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-[11px] text-slate-400 hover:border-brand-400 hover:text-brand-200 transition"
              title={isEditing ? 'Cancel edit' : 'Edit task'}
            >
              {isEditing ? '✕' : '✎'}
            </button>
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
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span
            className={classNames(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5',
              priorityMeta.color
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {priorityMeta.label}
          </span>
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
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-2 py-0.5">
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Update task details... (Enter to save, Esc to cancel)"
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40 resize-none"
          />
        ) : (
          task.description && (
            <p className="mt-1 text-xs text-slate-300 whitespace-pre-line">
              {task.description}
            </p>
          )
        )}
        {isEditing && (
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
        )}
      </div>
    </article>
  );
}

function TodoList({ tasks, ...handlers }) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-4 py-10 text-center text-sm text-slate-400">
        <p className="mb-1 font-medium text-slate-300">No tasks yet</p>
        <p className="text-xs text-slate-500">
          Add your first task above and it will appear here.
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

export default function App() {
  const [tasks, setTasks] = useState(loadInitialTasks);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function handleAddTask(task) {
    setTasks((prev) => [task, ...prev]);
  }

  function handleToggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function handleClearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  function handleTogglePin(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, pinned: !task.pinned } : task
      )
    );
  }

  function handleUpdateTask(id, updates) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }

  const availableTags = useMemo(() => {
    const tagSet = new Set();
    tasks.forEach((task) => {
      (task.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    if (statusFilter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (activeTag) {
      result = result.filter((t) => t.tags?.includes(activeTag));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      const pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinDiff !== 0) return pinDiff;
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'due_asc':
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        case 'due_desc':
          return (b.dueDate || '').localeCompare(a.dueDate || '');
        case 'priority_desc': {
          const order = { high: 2, medium: 1, low: 0 };
          return (order[b.priority] || 0) - (order[a.priority] || 0);
        }
        default:
          return 0;
      }
    });
    return result;
  }, [tasks, statusFilter, sortBy, search, priorityFilter, activeTag]);

  const hasCompleted = tasks.some((t) => t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
         
        </div>
        <Header
          onClearCompleted={handleClearCompleted}
          hasCompleted={hasCompleted}
          taskCount={tasks.length}
        />
        <TodoInput onAdd={handleAddTask} />
        <StatsBar tasks={tasks} />
        <FiltersBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          search={search}
          setSearch={setSearch}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          availableTags={availableTags}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
        />
        <TodoList
          tasks={filteredAndSortedTasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onTogglePin={handleTogglePin}
          onUpdate={handleUpdateTask}
        />
        <footer className="mt-8 border-t border-slate-900/80 pt-3 text-[11px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p>
            All data is stored in your browser's localStorage.
          </p>
          <p className="text-slate-600">
            Built with <span className="text-brand-400 font-medium">React</span> &amp;{' '}
            <span className="text-brand-400 font-medium">Tailwind CSS</span>.
          </p>
        </footer>
      </main>
    </div>
  );
} 