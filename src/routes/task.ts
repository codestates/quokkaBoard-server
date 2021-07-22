/* Module setting */
import express from 'express';

/* Import endpoint */
import task from '@controllers/task';

/* Endpoint routing */
const taskRouter = express.Router();

taskRouter.post('/create-task', task.createTask);
taskRouter.delete('/delete-task', task.deleteTask);
taskRouter.patch('/update-duedate', task.updateDueDate);
taskRouter.patch('/update-task-name', task.updateTaskName);
taskRouter.patch('/update-description', task.updateDescription);
taskRouter.post('/add-assignee', task.addAssignee);
taskRouter.delete('/delete-assignee', task.deleteAssignee);
taskRouter.patch('/shift-task', task.shiftTask);
taskRouter.patch('/check-task', task.checkTask);

export default taskRouter;