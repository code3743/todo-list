export const STORAGE_KEYS = {
  TASKS: 'todo_tasks',
  CATEGORIES: 'todo_categories',
} as const;

export const FIRESTORE_COLLECTIONS = {
  TASKS: 'tasks',
  CATEGORIES: 'categories',
} as const;

export const REMOTE_CONFIG_KEYS = {
  ENABLE_CATEGORIES: 'enable_categories',
} as const;

export const CATEGORY_COLORS: string[] = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
];
