import api from './api.js';

export async function getTasks(params = {}) {
  const { data } = await api.get('/tasks', { params });
  return data;
}

export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}

export async function duplicateTask(id) {
  const { data } = await api.post(`/tasks/${id}/duplicate`);
  return data;
}

export async function archiveTask(id) {
  const { data } = await api.patch(`/tasks/${id}/archive`);
  return data;
}

export async function restoreTask(id) {
  const { data } = await api.patch(`/tasks/${id}/restore`);
  return data;
}
