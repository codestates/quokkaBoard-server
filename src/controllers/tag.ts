import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Task } from '@entity/Task';
import { Tag } from '@entity/Tag'
import { TaskRepo } from '@repo/taskQ';
import { TypeReq, StrProps, StrNumProps, TaskProps } from '@types';


const tag = {

    createTag: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const { title, boardId } = req.body;
            const taskRepo = getRepository(Task);
            const customTaskRepo = getCustomRepository(TaskRepo);
            const uniqNum = await customTaskRepo.getMaxIdx();
            
            const newTask = new Task();
            newTask.title = title as string;
            newTask.index = uniqNum + 1;
            newTask.boardId = boardId as number;
            newTask.comment_id = uniqNum + 1;
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

    updateTag: async (req: TypeReq<TaskProps>, res: Response) => {
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

    readTag: async (req: TypeReq<TaskProps>, res: Response) => {
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

    deleteTag: async (req: TypeReq<TaskProps>, res: Response) => {
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
    }

}

export default tag;