import express from 'express'
import kanban from '../controllers/kanban'

const kanbanRouter = express.Router();
kanbanRouter.post('/create-board', kanban.createBoard);
kanbanRouter.delete('/remove-board', kanban.removeBoard);
kanbanRouter.patch('/update-board', kanban.updateBoard);
kanbanRouter.patch('/shift-board', kanban.shiftBoard);
kanbanRouter.post('/all-board-info', kanban.allBoardInfo);

export default kanbanRouter;