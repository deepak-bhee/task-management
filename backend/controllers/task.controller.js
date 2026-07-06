import Task from '../models/Task.js';
import {
  buildTaskQuery,
  buildTaskSort,
  normalizeTaskCompletion
} from '../services/task.service.js';
import { httpError } from '../utils/httpError.js';
import {
  validateCreateTaskInput,
  validateTaskFilters,
  validateTaskId,
  validateUpdateTaskInput
} from '../utils/taskValidation.js';
import { getIO } from '../utils/socket.js';

export async function listTasks(req, res, next) {
  try {
    validateTaskFilters(req.query);

    const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '20', 10), 1), 100);
    const skip = (page - 1) * limit;
    const filters = buildTaskQuery(req.user._id, req.query);
    const sort = buildTaskSort(req.query);
    const needsPrioritySort = req.query.sortBy === 'priority';

    if (needsPrioritySort) {
      const [tasks, total] = await Promise.all([
        Task.aggregate([
          { $match: filters },
          {
            $addFields: {
              priorityRank: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$priority', 'High'] }, then: 3 },
                    { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                    { case: { $eq: ['$priority', 'Low'] }, then: 1 }
                  ],
                  default: 0
                }
              }
            }
          },
          { $sort: sort },
          { $skip: skip },
          { $limit: limit },
          { $project: { priorityRank: 0 } }
        ]),
        Task.countDocuments(filters)
      ]);

      return res.status(200).json({
        tasks,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    }

    const [tasks, total] = await Promise.all([
      Task.find(filters).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(filters)
    ]);

    res.status(200).json({
      tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    validateTaskId(req.params.id);

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      throw httpError(404, 'Task not found');
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const payload = normalizeTaskCompletion(validateCreateTaskInput(req.body));
    const task = await Task.create({
      ...payload,
      userId: req.user._id
    });

    // Emit socket event for real-time update
    getIO()?.to(req.user._id.toString()).emit('task_created', {
      taskId: task._id,
      task: task.toObject()
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    validateTaskId(req.params.id);

    const updates = normalizeTaskCompletion(validateUpdateTaskInput(req.body));
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw httpError(404, 'Task not found');
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    validateTaskId(req.params.id);

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      throw httpError(404, 'Task not found');
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function duplicateTask(req, res, next) {
  try {
    validateTaskId(req.params.id);

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      throw httpError(404, 'Task not found');
    }

    const duplicate = await Task.create({
      title: `${task.title} Copy`,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      completed: task.completed,
      archived: false,
      userId: req.user._id
    });

    res.status(201).json({ task: duplicate });
  } catch (error) {
    next(error);
  }
}

export async function archiveTask(req, res, next) {
  try {
    validateTaskId(req.params.id);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archived: true },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw httpError(404, 'Task not found');
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function restoreTask(req, res, next) {
  try {
    validateTaskId(req.params.id);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archived: false },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw httpError(404, 'Task not found');
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}
