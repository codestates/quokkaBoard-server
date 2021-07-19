import { NextFunction, Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Project } from '@entity/Project';
import { UserProject } from '@entity/UserProject';
import { UserRepo } from '@repo/userQ';
import { ProjectRepo } from '@repo/projectQ';
import { UserProjectRepo } from '@repo/userProjectQ';
import { TypeReq, StrProps, StrArrProps } from '@types';
import { defaultLabel } from '@data/tagData';
import { Tag } from '@entity/Tag';


const project = {

    createProject: async (req: TypeReq<StrProps>, res: Response, next: NextFunction) => {
        try {
            const { 
                title, description, startDate, endDate 
            } = req.body;
            const projectRepo = getRepository(Project);
            const userRepo = getCustomRepository(UserRepo);
            const userProjectRepo = getRepository(UserProject);
            const findUser = await userRepo.findUser(req.body);
            if(findUser.length === 0) throw new Error('user');
        
            const newProject = new Project();
            newProject.title = title;
            newProject.description = description;
            newProject.start_date = startDate;
            newProject.end_date = endDate;
            const findProject = await projectRepo.save(newProject);
            
            const newUserProject = new UserProject();
            newUserProject.authority = 'MASTER';
            newUserProject.userId = findUser[0].id;
            newUserProject.projectId = findProject.id;
            userProjectRepo.save(newUserProject);

            const labels: [{[key: string]: string}] = defaultLabel as any;
            const projectLabels: object[] = [];
            labels.forEach(label =>  {
                label['projectId'] = findProject.id
                projectLabels.push(Object.assign({}, label))
            });
            const tagRepo = getRepository(Tag);
            await tagRepo.save(projectLabels);
        
            res.status(200).send({ 
                success: true, 
                projectId: findProject.id 
            });
        } catch (e) {
            e.message === 'user'
            ? res.status(202).send({ 
                success: false,
                message: '잘못된 유저 정보입니다' 
            })
            : res.status(500).send(
                'server error'
            );
        }
    },

    removeProject: async (req: TypeReq<StrProps>, res: Response) => {
        try { 
            const projectRepo = getRepository(Project);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findAuth = await userProjectRepo.findAuthProject(req.body);

            if(!findAuth) throw new Error('id');
            if(findAuth.authority !== 'MASTER') throw Error;// 권한체크 미들웨어 작성시 삭제
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
                .filter(el => el.projectId === projectId);
            if(findUser.length === 0) throw new Error('user');
            console.log(findUser)
            const data = {
                userId: findUser[0].userId as string, 
                projectId: findUser[0].projectId as string,
                authority: authority
            }
            await userProjectRepo.changeUserAuth(data);
            findUser[0].authority = authority;

            res.status(200).send({ 
                success: true,
                message: '권한이 변경되었습니다',
                data: findUser
            }); 
        } catch (e) {
            return e.message === 'auth'
            ? res.status(202).send({ 
                success: false,
                message: '잘못된 요청입니다'
            })
            : res.status(500).send(
                "server error"
            )
        }
    },

    modifyProject: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { projectId, startDate, endDate } = req.body;
            if(!startDate) delete req.body.startDate;
            if(!endDate) delete req.body.endDate;
            
            const projectRepo = getCustomRepository(ProjectRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findProject = await projectRepo.findProject(projectId);
            const findUser = await userProjectRepo.findAuthProject(req.body);
            
            if(!findProject) throw new Error('id');
            if(!findUser) throw new Error('user');
            if(findUser.authority !== 'MASTER') throw Error;
            
            req.body.title = req.body.title || findProject.title;
            projectRepo.editProject(req.body);
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

    inviteMember: async (req: TypeReq<StrArrProps>, res: Response) => {
        try {
            const { projectId, nickname } = req.body;
            const projectRepo = getRepository(Project);
            const userRepo = getCustomRepository(UserRepo);
            const userProjectRepo = getCustomRepository(UserProjectRepo);

            const findProject = await projectRepo.findOne(projectId as string);
            req.body.nickname = (await userRepo.findMemberInUser(req.body))
                .map(el => el.user_nickname)
                .concat(nickname)
                .filter((el, i, arr) => arr.indexOf(el) === arr.lastIndexOf(el));
            const findUser = await userRepo.findUser(req.body);
            
            if(findUser.length === 0 || !findProject) throw new Error('user');
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
                        nickname: el.nickname,
                        email: el.email,
                        authority: 'READ'
                    });
                });
                await userProjectRepo.addProjectMember(userData);
            
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
            : res.status(500).send(
                "server error"
            );
        }
    },

    projectList: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findProjectList = await userProjectRepo.findProjectList(req.body);
            console.log(findProjectList)
            res.status(200).send({ 
                success: true,
                data: findProjectList
            }); 
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '잘못된 요청입니다' 
            });
        }
    },

    projectMembers: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findProjectUser = await userProjectRepo.findAllProjectUser(req.body);

            res.status(200).send({ 
                success: true,
                data: findProjectUser
            }); 
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '잘못된 요청입니다' 
            });
        }
    },

    removeMember: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findProjectUser = await userProjectRepo.findUserInProject(req.body);
            if(!findProjectUser) throw Error;
            
            userProjectRepo.delete(findProjectUser.id);
            res.status(200).send({ 
                success: true,
                data: findProjectUser
            }); 
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '존재하지 않는 사용자입니다'
            });
        }
    },

    dashBoardInfo: async (req: TypeReq<StrProps>, res: Response) => {
        
    },

}

export default project;