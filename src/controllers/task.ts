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
            const { title, dueDate, tagId, userId, boardId } = req.body;
            const boardRepo = getCustomRepository(BoardRepo);
            const taskRepo = getCustomRepository(TaskRepo);
            
            const uniqNum = await taskRepo.getMaxIdx();
            const findBoard = await boardRepo.findBoard(boardId as string);
            if(!findBoard) throw new Error('board');
            
            const newTask = new Task();
            newTask.title = title as string
            newTask.due_date = dueDate as string
            newTask.projectId = findBoard.projectId;
            newTask.cIdx = uniqNum + 1;
            newTask.label_id = uniqNum + 1;
            const findTask = await taskRepo.save(newTask);
            
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const userProjectId = await userProjectRepo.findUserProjectId(userId, findBoard.projectId);
            
            await boardRepo.joinTaskToBoard(findBoard.id, findTask.id);
            await taskRepo.joinTagToTask(findTask.label_id, tagId);
            await taskRepo.taskAssignee(findTask.id, userProjectId);
            
            res.status(200).send({ 
                success: true, 
                data: findTask
            });
        } catch (e) {
            e.message = 'board'
            ? res.status(202).send({ 
                success: false,
                message: '존재하지 않는 보드입니다' 
            })
            : res.status(500).send('server error');
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
            if(!findTask) throw new Error('task');
            
            req.body.title = req.body.title || findTask.title;
            req.body.description = req.body.description || findTask.description;
            req.body.dueDate = req.body.dueDate || findTask.due_date;
            taskRepo.updateTask(req.body);

            res.status(200).send({success: true});
        } catch (e) {
            e.message === 'task'
            ? res.status(202).send({
                success: false,
                message: '존재하지 않는 태스크입니다' 
            })
            : res.status(500).send('server error')
        }
    },

    updateTaskName: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw new Error('task');
        
            req.body.title = req.body.title || findTask.title;
            req.body.description = req.body.description || findTask.description;
            req.body.dueDate = req.body.dueDate || findTask.due_date;
            taskRepo.updateTask(req.body);

            res.status(200).send({success: true});
        } catch (e) {
            e.message === 'task'
            ? res.status(202).send({
                success: false,
                message: '존재하지 않는 태스크입니다' 
            })
            : res.status(500).send('server error')
        }
    },

    updateDescription: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw new Error('task');
            
            req.body.title = req.body.title || findTask.title;
            req.body.description = req.body.description || findTask.description;
            req.body.dueDate = req.body.dueDate || findTask.due_date;
            taskRepo.updateTask(req.body);
            
            res.status(200).send({success: true});
        } catch (e) {
            e.message === 'task'
            ? res.status(202).send({
                success: false,
                message: '존재하지 않는 태스크입니다' 
            })
            : res.status(500).send('server error');
        }
    },

    addAssignee: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const { taskId, userId } = req.body
            const taskRepo = getCustomRepository(TaskRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            
            const findProject = await taskRepo.findProjectInTask(req.body);
            const userProjectId = await userProjectRepo.findUserProjectId(userId, findProject.projectId);
            if(userProjectId.length === 0 ) throw new Error('project');

            await taskRepo.taskAssignee(taskId, userProjectId);
            res.status(200).send({success: true});
        } catch (e) {
            e.message === 'message'
            ? res.status(202).send({
                success: false,
                message: '프로젝트 사용자가 아닙니다'
            })
            : res.status(500).send('server error');
        }
    },

    deleteAssignee: async (req: TypeReq<TaskProps>, res: Response) => {
        try{
            const { taskId, userId } = req.body
            const taskRepo = getCustomRepository(TaskRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            
            const findProject = await taskRepo.findProjectInTask(req.body);
            const userProjectId = await userProjectRepo.findUserProjectId(userId, findProject.projectId);
            if(userProjectId.length === 0 ) throw Error;

            await taskRepo.removeAssignee(taskId, userProjectId);
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
            if(task.length === 0) throw new Error('task');

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
            if(!findTask) throw new Error('task');

            !findTask.completed
            ? await taskRepo.checkTask(findTask.id, true)
            : await taskRepo.checkTask(findTask.id, false);
            
            res.status(200).send({
                success: true,
                data: findTask
            });
        } catch (e) {
            e.message === 'task'
            ? res.status(202).send({
                success: false,
                message: '태스크가 존재하지 않습니다'
            })
            : res.status(202).send('server error');
        }
    },
}

export default task;