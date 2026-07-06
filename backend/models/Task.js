import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'College', 'Internship', 'Health', 'Shopping'],
      default: 'Personal'
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, status: 1, priority: 1, category: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Task', taskSchema);
