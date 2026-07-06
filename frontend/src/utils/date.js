export function formatDate(value) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function isOverdue(task) {
  if (!task?.dueDate || task.status === 'Completed' || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}
