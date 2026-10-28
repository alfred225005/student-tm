import { Router } from 'express';
import protect from '../middleware/auth.js';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';

const router = Router();
router.use(protect);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
export default router;
