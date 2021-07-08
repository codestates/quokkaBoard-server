import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Project } from '@entity/Project';
import { UserProject } from '@entity/UserProject';
import { UserRepo } from '@repo/userQ';
import { ProjectRepo } from '@repo/projectQ';
import { UserProjectRepo } from '@repo/userProjectQ';
import { TypeReq, StrProps, InviteUser } from '@types';


const project = {

    createProject: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { userId, title, startDate, endDate } = req.body;
            const projectRepo = getRepository(Project);
            const userRepo = getCustomRepository(UserRepo);
            const userProjectRepo = getRepository(UserProject);
            const findUser = await userRepo.findId(userId);
        
            const newProject = new Project();
            newProject.title = title;
            newProject.start_date = startDate;
            newProject.end_date = endDate;
            const findProject = await projectRepo.save(newProject);
            
            const newUserProject = new UserProject();
            newUserProject.authority = 'MASTER';
            newUserProject.userId = findUser.id;
            newUserProject.projectId = findProject.id;
            userProjectRepo.save(newUserProject);

            res.status(200).send({ 
                success: true, 
                projectId: findProject.id 
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '잘못된 유저 정보입니다' 
            });
        }
    },

    removeProject: async (req: TypeReq<StrProps>, res: Response) => {
        try { 
            const { userId, projectId } = req.body;
            const projectRepo = getRepository(Project);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findAuth = await userProjectRepo.findAuthProject(userId, projectId);

            if(!findAuth) throw new Error('id');
            if(findAuth.authority !== 'MASTER') throw new Error();
            else {
                projectRepo.delete({ id: findAuth.projectId });
                res.status(200).send({ success: true });
            }
        } catch (e) {
            return e.message === 'id'
            ? res.status(202).send({ 
                success: false,
                message: '잘못된 프로젝트 정보입니다'
            })
            : res.status(202).send({ 
                success: false,
                message: '권한이 없습니다'
            });
        }
    },

    modifyAuthority: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { projectId, email, authority } = req.body;
            const userRepo = getCustomRepository(UserRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            if(!authority) throw new Error('auth');
        
            const findUser = (await userRepo.findUserAuth(email))
            .filter(el => el.users_projectId === projectId);
            if(findUser.length === 0) throw new Error();

            userProjectRepo.changeUserAuth(findUser[0].users_id, authority);
            res.status(200).send({ 
                success: true,
                message: '권한이 변경되었습니다'
            }); 
        } catch (e) {
            return e.message === 'auth'
            ? res.status(202).send({ 
                success: false,
                message: '잘못된 요청입니다'
            })
            : res.status(202).send({ 
                success: false,
                message: '프로젝트 사용자가 아닙니다'
            });
        }
    },

    modifyProject: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { userId, projectId, startDate, endDate } = req.body
            const projectRepo = getCustomRepository(ProjectRepo)
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findProject = await projectRepo.findProject(projectId);
            const findUser = await userProjectRepo.findAuthProject(userId, projectId);
            
            if(!findProject) throw new Error('id');
            if(!findUser) throw new Error('user');
            if(findUser.authority !== 'MASTER') throw new Error();
            
            let title = req.body.title || findProject.title;
            projectRepo.editProject(findUser.projectId, {title, startDate, endDate});
            res.status(200).send({ success: true });
        } catch (e) {
            if(e.message === 'id') res.status(202).send({
                success: false, 
                message: '존재하지 않는 프로젝트입니다'
            });
            if (e.message === 'user') res.status(202).send({
                success: false, 
                message: '프로젝트 사용자가 아닙니다'
            });
            else res.status(202).send({
                success: false,
                message: '권한이 없습니다'
            });
        }
    },

    inviteMember: async (req: TypeReq<InviteUser>, res: Response) => {
        try {
            const { nickname, projectId } = req.body;
            const projectRepo = getRepository(Project);
            const userRepo = getCustomRepository(UserRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findUser = await userRepo.findNickName(nickname);
            const findProject = await projectRepo.findOne(projectId);
            
            if(findUser.length === 0) throw new Error('user');
            if(!findProject) throw new Error();
            else {
                const userData: object[] = [];
                const resData: object[] = [];
                findUser.forEach(el => {
                    userData.push({ 
                        authority: 'READ',
                        userId: el.id , 
                        projectId: findProject.id
                    });
                    resData.push({ 
                        userId: el.id, 
                        nickname: el.nickname 
                    });
                });
                userProjectRepo.addProjectMember(userData);
            
                res.status(200).send({ 
                    success: true, 
                    data: resData 
                });
            }
        } catch (e) {
            return e.message === 'user'
            ? res.status(202).send({ 
                succes: false,
                message: '일치하는 사용자가 없습니다'
            })
            : res.status(202).send({ 
                succes: false,
                message: '잘못된 프로젝트 정보입니다'
            });
        }
    },

    dashBoardInfo: async (req: TypeReq<StrProps>, res: Response) => {

    },

}

export default project;