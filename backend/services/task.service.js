const allowedSortFields = new Set(['dueDate', 'createdAt', 'priority']);

export const taskCategories = ['Personal', 'Work', 'College', 'Internship', 'Health', 'Shopping'];
export const taskPriorities = ['Low', 'Medium', 'High'];
export const taskStatuses = ['Pending', 'In Progress', 'Completed'];

export function buildTaskQuery(userId, query = {}) {
  const filters = { userId };

  if (query.archived === 'true') {
    filters.archived = true;
  } else if (query.archived === 'all') {
    delete filters.archived;
  } else {
    filters.archived = false;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.priority) {
    filters.priority = query.priority;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.completed === 'true') {
    filters.completed = true;
  }

  if (query.completed === 'false') {
    filters.completed = false;
  }

  if (query.search) {
    filters.title = { $regex: query.search.trim(), $options: 'i' };
  }

  return filters;
}

export function buildTaskSort(query = {}) {
  const sortBy = allowedSortFields.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  if (sortBy === 'priority') {
    return { priorityRank: sortOrder, createdAt: -1 };
  }

  return { [sortBy]: sortOrder, createdAt: -1 };
}

export function normalizeTaskCompletion(task) {
  if (task.status === 'Completed') {
    task.completed = true;
  } else if (task.completed) {
    task.status = 'Completed';
  } else if (task.status && task.status !== 'Completed') {
    task.completed = false;
  }

  return task;
}
