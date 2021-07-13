import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Task } from '@entity/Task';
import { TaskRepo } from '@repo/taskQ';
import { TypeReq, StrProps, StrNumProps, TaskProps } from '@types';
import { BoardRepo } from '@repo/boardQ';


const task = {

    createTask: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const { title, dueDate } = req.body;
            const taskRepo = getRepository(Task);
            const boardRepo = getCustomRepository(BoardRepo);
            const customTaskRepo = getCustomRepository(TaskRepo);
            const uniqNum = await customTaskRepo.getMaxIdx();
            const findBoard = await boardRepo.findBoard(req.body);
            if(!findBoard) throw new Error('board');
            
            const newTask = new Task();
            newTask.title = title as string;
            newTask.due_date = dueDate as string;
            newTask.projectId = findBoard.projectId;
            newTask.cIdx = uniqNum + 1;
            newTask.label_id = uniqNum + 1;
            const findTask = await taskRepo.save(newTask);

            boardRepo.joinTaskToBoard(findBoard.id, findTask.id);
            
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

    addAssignee: async (req: TypeReq<StrProps>, res: Response) => {
    
    },

    deleteAssignee: async (req: TypeReq<StrProps>, res: Response) => {
    
    },

    shiftBoard: async (req: TypeReq<StrProps>, res: Response) => {
    
    }

}

export default task;