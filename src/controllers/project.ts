import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Project } from '@entity/Project';
import { UserProject } from '@entity/UserProject';
import { UserRepo } from '@repo/userQ';
import { UserProjectRepo } from '@repo/userProjectQ';
import { typeReq, strProps } from '@types';


const project = {

    createProject: async (req: typeReq<strProps>, res: Response) => {
        
        const { userId, title, startDate, endDate } = req.body;
        const projectRepo = getRepository(Project);
        const userProjectRepo = getRepository(UserProject)
        try {
            const newProject = new Project();
            newProject.title = title;
            newProject.start_date = startDate;
            newProject.end_date = endDate;
            const findProject = await projectRepo.save(newProject);
            
            const newUserProject = new UserProject();
            newUserProject.authority = 'ADMIN';
            newUserProject.userId = userId;
            newUserProject.projectId = findProject.id;
            userProjectRepo.save(newUserProject);

            res.status(200).send({ success: true, projectId: findProject.id });
        } catch (e) {
            res.status(202).send({ success: false });
        }
        
    },

    removeProject: async (req: typeReq<strProps>, res: Response) => {

        const { userId, projectId } = req.body;
        const projectRepo = getRepository(Project);
        const customUserProjectRepo = getCustomRepository(UserProjectRepo);
        const findAuth = await customUserProjectRepo.findAuthProject(userId, projectId);
        
        if(findAuth.authority === 'ADMIN') {
            projectRepo.delete({ id: findAuth.projectId });
            res.status(200).send({ success: true });
        } else {
            res.status(202).send({ success: false });
        }

    },

    modifyAuthority: async (req: typeReq<strProps>, res: Response) => {
        
        const { projectId, email, authority } = req.body;
        const customUserRepo = getCustomRepository(UserRepo)
        const customUserProjectRepo = getCustomRepository(UserProjectRepo);
        try {
            const findUser = (await customUserRepo.findUserAuth(email)).filter(el =>
                el.users_projectId === projectId && el.users_authority !== authority
            );
            customUserProjectRepo.changeUserAuth(findUser[0].users_id, authority);
            res.status(200).send({ success: true }); 
        } catch (e) {
            res.status(202).send({ success: false });
        }

    },

    dashBoardInfo: async (req: typeReq<strProps>, res: Response) => {



    },

}

export default project;