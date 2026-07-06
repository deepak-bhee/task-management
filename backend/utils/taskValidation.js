import mongoose from 'mongoose';
import { taskCategories, taskPriorities, taskStatuses } from '../services/task.service.js';
import { httpError } from './httpError.js';

function validateEnum(value, allowedValues, fieldName) {
  if (value !== undefined && !allowedValues.includes(value)) {
    throw httpError(400, `${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
}

function validateDueDate(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw httpError(400, 'Due date must be a valid date');
  }

  return date;
}

function parseBoolean(value, fieldName) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw httpError(400, `${fieldName} must be true or false`);
}

export function validateTaskId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError(400, 'Task id is invalid');
  }
}

export function validateTaskFilters(query) {
  validateEnum(query.status, taskStatuses, 'Status');
  validateEnum(query.priority, taskPriorities, 'Priority');
  validateEnum(query.category, taskCategories, 'Category');

  if (query.completed !== undefined && !['true', 'false'].includes(query.completed)) {
    throw httpError(400, 'Completed filter must be true or false');
  }

  if (query.archived !== undefined && !['true', 'false', 'all'].includes(query.archived)) {
    throw httpError(400, 'Archived filter must be true, false, or all');
  }

  if (query.sortBy !== undefined && !['dueDate', 'createdAt', 'priority'].includes(query.sortBy)) {
    throw httpError(400, 'Sort field must be dueDate, createdAt, or priority');
  }

  if (query.sortOrder !== undefined && !['asc', 'desc'].includes(query.sortOrder)) {
    throw httpError(400, 'Sort order must be asc or desc');
  }
}

export function validateCreateTaskInput(body) {
  const title = String(body?.title || '').trim();

  if (title.length < 2) {
    throw httpError(400, 'Title must be at least 2 characters long');
  }

  const task = {
    title,
    description: typeof body?.description === 'string' ? body.description.trim() : '',
    category: body?.category || 'Personal',
    priority: body?.priority || 'Medium',
    status: body?.status || 'Pending',
    dueDate: validateDueDate(body?.dueDate),
    completed: body?.completed === undefined ? false : parseBoolean(body.completed, 'Completed'),
    archived: body?.archived === undefined ? false : parseBoolean(body.archived, 'Archived')
  };

  validateEnum(task.category, taskCategories, 'Category');
  validateEnum(task.priority, taskPriorities, 'Priority');
  validateEnum(task.status, taskStatuses, 'Status');

  return task;
}

export function validateUpdateTaskInput(body) {
  const allowedFields = ['title', 'description', 'category', 'priority', 'status', 'dueDate', 'completed', 'archived'];
  const updates = {};

  for (const field of allowedFields) {
    if (body?.[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw httpError(400, 'At least one task field is required');
  }

  if (updates.title !== undefined) {
    updates.title = String(updates.title).trim();

    if (updates.title.length < 2) {
      throw httpError(400, 'Title must be at least 2 characters long');
    }
  }

  if (updates.description !== undefined) {
    updates.description = String(updates.description).trim();
  }

  if (updates.dueDate !== undefined) {
    updates.dueDate = validateDueDate(updates.dueDate);
  }

  if (updates.completed !== undefined) {
    updates.completed = parseBoolean(updates.completed, 'Completed');
  }

  if (updates.archived !== undefined) {
    updates.archived = parseBoolean(updates.archived, 'Archived');
  }

  validateEnum(updates.category, taskCategories, 'Category');
  validateEnum(updates.priority, taskPriorities, 'Priority');
  validateEnum(updates.status, taskStatuses, 'Status');

  return updates;
}
