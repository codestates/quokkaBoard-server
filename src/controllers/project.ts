import { Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import { Project } from '../db/entity/Project';
import { UserProject } from '../db/entity/UserProject';
import { UserRepo } from '../db/repo/userQ';
import { ProjectRepo, UserProjectRepo } from '../db/repo/userProjectQ';
import { TypeReq, StrProps, StrArrProps } from '../types';
import { defaultLabel } from '../db/data/tagData';
import { Tag } from '../db/entity/Tag';
import { convertDate } from '../util/date';


const project = {

    createProject: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { title, description, startDate, endDate } = req.body;
            const projectRepo = getRepository(Project);
            const userRepo = getCustomRepository(UserRepo);
            const userProjectRepo = getRepository(UserProject);
            const findUser = await userRepo.findUser(req.body);
            if(findUser.length === 0) throw new Error('user');

            const start_date = convertDate(startDate);
            const end_date = convertDate(endDate);
        
            const newProject = new Project();
            newProject.title = title;
            newProject.description = description;
            newProject.start_date = start_date;
            newProject.end_date = end_date;
            const findProject = await projectRepo.save(newProject);
            
            const newUserProject = new UserProject();
            newUserProject.authority = 'MASTER';
            newUserProject.userId = findUser[0].id;
            newUserProject.projectId = findProject.id;
            await userProjectRepo.save(newUserProject);

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
            : res.status(500).send('server error');
        }
    },

    removeProject: async (req: TypeReq<StrProps>, res: Response) => {
        try { 
            const projectRepo = getRepository(Project);
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findAuth = await userProjectRepo.findAuthProject(req.body);

            if(!findAuth) throw new Error('user');
            if(findAuth.authority !== 'MASTER') throw new Error('user');
            else {
                projectRepo.delete({id: findAuth.projectId});
                res.status(200).send({success: true});
            }
        } catch (e) {
            return e.message === 'user'
            ? res.status(202).send({ 
                success: false,
                message: '잘못된 프로젝트 정보입니다'
            })
            : res.status(202).send('server error');
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
            if(findUser.length === 0) throw new Error('auth');
            
            await userProjectRepo.createQueryBuilder("user_project")
                .update(UserProject)
                .set({authority: authority})
                .where({
                    userId: findUser[0].userId,
                    projectId: findUser[0].projectId
                })
                .execute();
            findUser[0].authority = authority;

            res.status(200).send({ 
                success: true,
                message: '권한이 변경되었습니다',
                data: findUser
            }); 
        } catch (e) {
            e.message === 'auth'
            ? res.status(202).send({ 
                success: false,
                message: '잘못된 요청입니다'
            })
            : res.status(500).send('server error');
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
            if(!findProject || !findUser) throw new Error('user');
            
            req.body.title = req.body.title || findProject.title;
            await projectRepo.createQueryBuilder("project")
                .update(Project)
                .set({
                    title: req.body.title,
                    description: req.body.description,
                    start_date: req.body.startDate,
                    end_date: req.body.endDate
                })
                .where({id: projectId})
                .execute();
            
            res.status(200).send({success: true});
        } catch (e) {
            e.message === 'user'
            ? res.status(202).send({
                success: false, 
                message: '잘못된 요청입니다'
            })
            : res.status(500).send('server error');
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
                await userProjectRepo.createQueryBuilder("user_project")
                    .insert()
                    .into(UserProject)
                    .values(userData)
                    .execute();
            
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
            : res.status(500).send('server error');
        }
    },

    projectList: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userProjectRepo = getCustomRepository(UserProjectRepo);
            const findProjectList = await userProjectRepo.findProjectList(req.body);
            
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
            const findProjectUser = await userProjectRepo.findAllProjectUser(
                req.body.projectId
            );

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
            if(!findProjectUser) throw new Error("user");
            
            await userProjectRepo.delete(findProjectUser.id);
            res.status(200).send({ 
                success: true,
                data: findProjectUser
            }); 
        } catch (e) {
            e.message === "user"
            ? res.status(202).send({ 
                success: false,
                message: '존재하지 않는 사용자입니다'
            })
            : res.status(500).send('server error')
        }
    },

    dashBoardInfo: async (req: TypeReq<StrProps>, res: Response) => {
        
    },

}

export default project;