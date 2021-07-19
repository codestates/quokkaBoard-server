import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Tag } from '@entity/Tag'
import { TaskRepo } from '@repo/taskQ';
import { TagRepo } from '@repo/tagQ'
import { TypeReq, StrProps, StrNumProps, TaskProps } from '@types';


const tag = {

    createTag: async (req: TypeReq<TaskProps>, res: Response) => {
        try {
            const tagRepo = getRepository(Tag);
            const taskRepo = getCustomRepository(TaskRepo);
            const findTask = await taskRepo.findTask(req.body);
            if(!findTask) throw new Error('task');
            
            const labels: [{[key: string]: string}] = req.body.labels;
            const projectLabels: object[] = [];
            labels.forEach(label => {
                label['projectId'] = findTask.projectId
                projectLabels.push(Object.assign({}, label))
            });
            await tagRepo.save(projectLabels);

            res.status(200).send({success: true})
        } catch (e) {
            e.message = 'task'
            ? res.status(202).send({ 
                success: false,
                message: '존재하지 않는 태스크입니다' 
            })
            : res.status(500).send(
                "server error"
            );
        }
    },

    updateTag: async (req: TypeReq<StrNumProps>, res: Response) => {
        try {
            const { content, hex } = req.body;
            if(!content) delete req.body.content;
            if(!hex) delete req.body.hex;

            const tagRepo = getCustomRepository(TagRepo);
            const findTag = await tagRepo.findTag(req.body);
            if(!findTag) throw new Error('tag');

            tagRepo.updateTag(req.body)
            res.status(200).send({success: true});
        } catch (e) {
            e.message = 'tag'
            ? res.status(202).send({ 
                success: false,
                message: '존재하지 않는 태그입니다' 
            })
            : res.status(202).send({ 
                success: false,
                message: '생성에 실패하였습니다' 
            });
        }    
    },

    readTag: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const tagRepo = getRepository(Tag);
            const findAllTag = await tagRepo.find({
                where: {projectId: req.body.projectId}
            });
            if(findAllTag.length === 0) throw Error;
            
            res.status(200).send({
                success: true,
                data: findAllTag
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '태그가 존재하지 않습니다' 
            });
        }
    },

    deleteTag: async (req: TypeReq<StrNumProps>, res: Response) => {
        try{
            const tagRepo = getCustomRepository(TagRepo);
            const findTag = await tagRepo.findTag(req.body);
            if(!findTag) throw Error;
        
            tagRepo.delete({id: findTag.id});
            res.status(200).send({success: true});
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '존재하지 않는 태그입니다' 
            });
        }
    }
}

export default tag;