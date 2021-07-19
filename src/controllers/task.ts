import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Task } from '@entity/Task';
import { TaskRepo } from '@repo/taskQ';
import { TypeReq, TaskProps, ShiftProps, StrArrProps, StrProps } from '@types';
import { BoardRepo } from '@repo/boardQ';
import { UserProjectRepo } from '@repo/userProjectQ';


const task = {

    createTask: async (req: TypeReq<StrArrProps>, res: Response) => {
        try {
            const { title, dueDate, tagId, userId } = req.body;
            const taskRepo = getRepository(Task);
            const boardRepo = getCustomRepository(BoardRepo);
            const customTaskRepo = getCustomRepository(TaskRepo);
            
            const uniqNum = await customTaskRepo.getMaxIdx();
            const findBoard = await boardRepo.findBoard(req.body);
            if(!findBoard) throw new Error('board');

            const newTask = new Task();
            newTask.title = title as string
            newTask.due_date = dueDate as string
            newTask.projectId = findBoard.projectId;
            newTask.cIdx = uniqNum + 1;
            newTask.label_id = uniqNum + 1;
            const findTask = await taskRepo.save(newTask);
            const boardId = findBoard.id
            
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const userProjectId = await userProjectRepo.findUserProjectId(userId);
            
            boardRepo.joinTaskToBoard(findBoard.id, findTask.id);
            customTaskRepo.joinTagToTask(findTask.label_id, tagId);
            customTaskRepo.taskAssignee(findTask.id, userProjectId);
            
            res.status(200).send({ 
                success: true, 
                data: findTask, boardId
            });
        } catch (e) {
            e.message = 'board'
            ? res.status(202).send({ 
                success: false,
                message: '존재하지 않는 보드입니다' 
            })
            : res.status(202).send({ 
                success: false,
                message: '생성에 실패하였습니다' 
            });
        }
    },

    deleteTask: async (req: TypeReq<TaskProps>, res: Response) => {
        try {
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw Error;
            
            taskRepo.delete({id: findTask.id});
            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '존재하지 않는 태스크입니다'
            });
        }    
    },

    updateDueDate: async (req: TypeReq<TaskProps>, res: Response) => {
        try {
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw Error;
            
            req.body.title = req.body.title || findTask.title;
            req.body.description = req.body.description || findTask.description;
            req.body.dueDate = req.body.dueDate || findTask.due_date;
            taskRepo.updateTask(req.body);

            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '존재하지 않는 태스크입니다' 
            });
        }
    },

    updateTaskName: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw Error;
        
            req.body.title = req.body.title || findTask.title;
            req.body.description = req.body.description || findTask.description;
            req.body.dueDate = req.body.dueDate || findTask.due_date;
            taskRepo.updateTask(req.body);

            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '존재하지 않는 태스크입니다' 
            });
        }
    },

    updateDescription: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw Error;
            
            req.body.title = req.body.title || findTask.title;
            req.body.description = req.body.description || findTask.description;
            req.body.dueDate = req.body.dueDate || findTask.due_date;
            taskRepo.updateTask(req.body);
            
            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '존재하지 않는 태스크입니다' 
            });
        }
    },

    addAssignee: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const { taskId, userId } = req.body
            const taskRepo = getCustomRepository(TaskRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            
            const userProjectId = await userProjectRepo.findUserProjectId(userId);
            if(userProjectId.length === 0 ) throw Error;

            taskRepo.taskAssignee(taskId, userProjectId);
            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '프로젝트 사용자가 아닙니다'
            });
        }
    },

    deleteAssignee: async (req: TypeReq<StrProps>, res: Response) => {
        try{
            const { taskId, userId } = req.body
            const taskRepo = getCustomRepository(TaskRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            
            const userProjectId = await userProjectRepo.findUserProjectId(userId);
            if(userProjectId.length === 0 ) throw Error;

            taskRepo.removeAssignee(taskId, userProjectId);
            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '프로젝트 사용자가 아닙니다'
            });
        }
    },

    shiftTask: async (req: TypeReq<ShiftProps>, res: Response) => {
        try {
            const { cIdx, targetIdx, boardId, targetId } = req.body;
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTaskInBoard(boardId);
            const targetTask = await taskRepo.findTaskInBoard(targetId);
            const task = findTask.filter(el => el.cIdx === cIdx);
            const index = findTask.findIndex(el => el.cIdx === cIdx);
            if(task.length === 0) throw Error;

            findTask[index].cIdx = 0;
            
            if(boardId === targetId) {
                if(cIdx < targetIdx) findTask.map(el => {
                    if(cIdx < el.cIdx && el.cIdx <= targetIdx) el.cIdx--
                });
                else findTask.map(el => {
                    if(cIdx > el.cIdx && el.cIdx >= targetIdx) el.cIdx++
                });
                findTask[index].cIdx = targetIdx;
                taskRepo.save(findTask); 
            
            } else {
                const lastIdx = Math.max(...targetTask.map(el => el.cIdx));
                taskRepo.removeTaskToBoard(boardId, task[0].id);
                taskRepo.joinTaskToBoard(targetId, task[0].id);
            
                if(lastIdx === targetIdx) {
                    findTask[index].cIdx = targetIdx + 1;
                } else { 
                    targetTask.map(el => {
                        if(el.cIdx >= targetIdx) el.cIdx++
                    });
                    findTask[index].cIdx = targetIdx;
                }
                taskRepo.save(findTask);
                taskRepo.save(targetTask);
            }

            const customBoardRepo = getCustomRepository(BoardRepo);
            const results = await customBoardRepo.findAllBoard(findTask[0].projectId);
            
            const init: { [key: string]: object[] } = {}
            const tasks = results.reduce((a,c) => {
                a[c.id] = {...c.tasks.map(el => el)};
                return a;
            }, init);

            const columns: { [key: string]: any } = {}
            for (let i=0; i < results.length; i++) {
                const result = results[i];
                columns[result.id] = result;
            }
            const columnOrder = results.map(el => el.id);
            const initialData = { tasks, columns, columnOrder };
            
            res.status(200).send({
                success: true,
                initialData
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '태스크가 존재하지 않습니다' 
            });
        }
    },

    checkTask: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body)
            if(!findTask) throw Error;

            !findTask.completed
            ? taskRepo.checkTask(findTask.id, true)
            : taskRepo.checkTask(findTask.id, false);
            
            res.status(200).send({
                success: true,
                data: findTask
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '태스크가 존재하지 않습니다'
            });
        }
    },
}

export default task;