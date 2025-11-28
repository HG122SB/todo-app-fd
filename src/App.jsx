// src/App.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { loadInitialTasks, saveTasks } from './utils/helpers';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import FiltersBar from './components/FiltersBar';
import StatsBar from './components/StatsBar';
import TodoList from './components/TodoList';

export default function App() {
  const [tasks, setTasks] = useState(loadInitialTasks);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [activeTag, setActiveTag] = useState(null);

  // Persistence effect
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // --- Task Handlers ---
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

  // --- Filter & Sort Logic ---
  
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    tasks.forEach((task) => {
      (task.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply Filters
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

    // Apply Sorting
    result.sort((a, b) => {
      // Pinning (Highest priority)
      const pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinDiff !== 0) return pinDiff;

      switch (sortBy) {
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'due_asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'due_desc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
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
            All data is stored in your browser's **localStorage**.
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