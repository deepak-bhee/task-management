import React from 'react';

export default function TaskFilters({ filters, onChange }) {
  return (
    <form className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        placeholder="Search title..."
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm"
      />

      <select value={filters.status || ''} onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
        <option value="">All status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select value={filters.priority || ''} onChange={(e) => onChange({ ...filters, priority: e.target.value || undefined })} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
        <option value="">All priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select value={filters.category || ''} onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
        <option value="">All categories</option>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="College">College</option>
        <option value="Internship">Internship</option>
        <option value="Health">Health</option>
        <option value="Shopping">Shopping</option>
      </select>

      <select value={filters.sortBy || 'createdAt'} onChange={(e) => onChange({ ...filters, sortBy: e.target.value })} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
        <option value="createdAt">Newest</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
      </select>

    </form>
  );
}
