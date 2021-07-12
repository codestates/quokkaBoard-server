import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Board } from '@entity/Board';
import { Task } from '@entity/Task';
import { BoardRepo } from '@repo/boardQ';
import { TaskRepo } from '@repo/taskQ';
import { TypeReq, StrProps, StrNumProps, TaskProps } from '@types';


const task = {

    createTask: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const { title, boardId } = req.body;
            const taskRepo = getRepository(Task);
            const customTaskRepo = getCustomRepository(TaskRepo);
            const uniqNum = await customTaskRepo.getMaxIdx();
            
            const newTask = new Task();
            newTask.title = title as string;
            newTask.index = uniqNum + 1;
            newTask.boardId = boardId as number;
            newTask.label_id = uniqNum + 1;
            const findTask = await taskRepo.save(newTask);

            res.status(200).send({ 
                success: true, 
                title: findTask.title,
                taskIndex: findTask.index
            });
        } catch (e) {
            res.status(202).send({ 
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
                message: '존재하지 않는 요청입니다'
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
                message: '존재하지 않는 요청입니다' 
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
                message: '존재하지 않는 요청입니다' 
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
                message: '존재하지 않는 요청입니다' 
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