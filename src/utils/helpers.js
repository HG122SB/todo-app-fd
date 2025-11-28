// src/utils/helpers.js

import { STORAGE_KEY, PRIORITY_OPTIONS } from '../constants';

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getPriorityMeta(priority) {
  // Finds priority metadata, defaults to Medium if not found
  return (
    PRIORITY_OPTIONS.find((p) => p.value === priority) || PRIORITY_OPTIONS[1]
  );
}

export function loadInitialTasks() {
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

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks', e);
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}