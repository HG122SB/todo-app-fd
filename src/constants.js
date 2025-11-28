// src/constants.js

export const STORAGE_KEY = 'advanced-react-todo-app-v1';

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  { value: 'high', label: 'High', color: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
];

export const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Newest' },
  { value: 'created_asc', label: 'Oldest' },
  { value: 'due_asc', label: 'Due date ↑' },
  { value: 'due_desc', label: 'Due date ↓' },
  { value: 'priority_desc', label: 'Priority' },
];