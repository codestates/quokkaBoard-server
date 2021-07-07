import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Project } from '@entity/Project';
import { UserProject } from '@entity/UserProject';
import { UserRepo } from '@repo/userQ';
import { UserProjectRepo } from '@repo/userProjectQ';
import { TypeReq, StrProps, InviteUser } from '@types';


const project = {

    createProject: async (req: TypeReq<StrProps>, res: Response) => {
        
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
            newUserProject.authority = 'MASTER';
            newUserProject.userId = userId;
            newUserProject.projectId = findProject.id;
            userProjectRepo.save(newUserProject);

            res.status(200).send({ success: true, projectId: findProject.id });
        } catch (e) {
            res.status(202).send({ success: false });
        }
        
    },

    removeProject: async (req: TypeReq<StrProps>, res: Response) => {

        const { userId, projectId } = req.body;
        const projectRepo = getRepository(Project);
        const userProjectRepo = getCustomRepository(UserProjectRepo);
        const findAuth = await userProjectRepo.findAuthProject(userId, projectId);
        
        if(findAuth.authority === 'MASTER') {
            projectRepo.delete({ id: findAuth.projectId });
            res.status(200).send({ success: true });
        } else {
            res.status(202).send({ success: false });
        }

    },

    modifyAuthority: async (req: TypeReq<StrProps>, res: Response) => {
        
        const { projectId, email, authority } = req.body;
        const userRepo = getCustomRepository(UserRepo);
        const userProjectRepo = getCustomRepository(UserProjectRepo);
        try {
            const findUser = (await userRepo.findUserAuth(email)).filter(el =>
                el.users_projectId === projectId && el.users_authority !== authority
            );
            userProjectRepo.changeUserAuth(findUser[0].users_id, authority);
            res.status(200).send({ success: true }); 
        } catch (e) {
            res.status(202).send({ success: false });
        }

    },

    inviteMember: async (req: TypeReq<InviteUser>, res: Response) => {

        const { nickname, projectId } = req.body;
        const userRepo = getCustomRepository(UserRepo)
        const userProjectRepo = getCustomRepository(UserProjectRepo);
        try{
            const userData: object[] = [];
            const resData: object[] = [];
            const findUser = await userRepo.findNickName(nickname)
            findUser.forEach(el => {
                userData.push({ authority: 'Read', userId: el.id , projectId: projectId })
                resData.push({ userId: el.id, nickname: el.nickname })
            });
            userProjectRepo.addProjectMember(userData);
            
            res.status(200).send({ success: true, data: resData });
        } catch (e) {
            res.status(202).send({ succes: false })
        }
    
    },

    dashBoardInfo: async (req: TypeReq<StrProps>, res: Response) => {



    },

}

export default project;