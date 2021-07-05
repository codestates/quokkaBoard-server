import { Response } from 'express';
import { getRepository } from 'typeorm';
import { Project } from '@entity/Project';
import { UserProject } from '@entity/UserProject';
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

            res.status(200).send({ success: true });
        } catch (e) {
            res.status(202).send({ success: false });
        }
        
    },

    removeProject: async (req: typeReq<strProps>, res: Response) => {

        

    },

    modifyAuthority: async (req: typeReq<strProps>, res: Response) => {
        
        // const customUserRepo = getCustomRepository(UserRepo)
        // const findUser = await customUserRepo.findNickName(req.body.nickname);
        // if(findUser === undefined) res.status(200).send({ success: true });
        // res.status(202).send({ success: false });

    },

    dashBoardInfo: async (req: typeReq<strProps>, res: Response) => {

        // const customUserRepo = getCustomRepository(UserRepo)
        // const { email, password } = req.body;
        // const findUser = await customUserRepo.findEmail(email);
        
        // if(findUser === undefined) return res.status(202).send({ 
        //     success: false, message: '존재하지 않는 이메일입니다' 
        // });
        // else if(!findUser.checkPass(password)) res.status(202).send({ 
        //     success: false, message: '비밀번호가 일치하지 않습니다' 
        // });
        
        // res.status(200).send({ success: true, userId: findUser.id });

    },

}

export default project;