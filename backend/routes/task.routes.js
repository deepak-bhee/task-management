import { Router } from 'express';
import {
  archiveTask,
  createTask,
  deleteTask,
  duplicateTask,
  getTask,
  listTasks,
  restoreTask,
  updateTask
} from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.post('/:id/duplicate', duplicateTask);
router.patch('/:id/archive', archiveTask);
router.patch('/:id/restore', restoreTask);
router.delete('/:id', deleteTask);

export default router;
