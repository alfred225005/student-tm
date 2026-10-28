import mongoose from 'mongoose';
import Task from '../models/Task.js';

function validateTask(body, partial = false) {
  const clean = {};
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 100) return { error: 'Task title is required and must be at most 100 characters.' };
    clean.title = body.title.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== 'string' || body.description.length > 500) return { error: 'Description must be 500 characters or fewer.' };
    clean.description = body.description.trim();
  }
  if (body.dueDate !== undefined) {
    if (body.dueDate === '' || body.dueDate === null) clean.dueDate = null;
    else if (typeof body.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) || Number.isNaN(Date.parse(`${body.dueDate}T12:00:00Z`))) return { error: 'Enter a valid due date.' };
    else clean.dueDate = new Date(`${body.dueDate}T12:00:00Z`);
  }
  if (body.priority !== undefined) {
    if (!['Low', 'Medium', 'High'].includes(body.priority)) return { error: 'Priority must be Low, Medium or High.' };
    clean.priority = body.priority;
  }
  if (body.status !== undefined) {
    if (!['Pending', 'In Progress', 'Completed'].includes(body.status)) return { error: 'Choose a valid task status.' };
    clean.status = body.status;
  }
  return { clean };
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ tasks });
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    const { clean, error } = validateTask(req.body);
    if (error) return res.status(400).json({ message: error });
    const task = await Task.create({ ...clean, user: req.user._id });
    res.status(201).json({ task });
  } catch (err) { next(err); }
}

export async function updateTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Task not found.' });
    const { clean, error } = validateTask(req.body, true);
    if (error) return res.status(400).json({ message: error });
    if (!Object.keys(clean).length) return res.status(400).json({ message: 'Provide at least one field to update.' });
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: clean }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) { next(err); }
}

export async function deleteTask(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Task not found.' });
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) { next(err); }
}
