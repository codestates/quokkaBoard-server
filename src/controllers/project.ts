import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userDm';
import { User } from '@entity/User';
import { Project } from '@entity/Project';
import { typeReq, strProps } from '@types';
import jwtToken from '@token/jwt';


const project = {

    createProject: async (req: typeReq<strProps>, res: Response) => {
        
        const userRepo = getRepository(User)
        const projectRepo = getRepository(Project)
        const { userId, title, startDate, endDate } = req.body;
        const newProject = new Project();
        newProject.title = title;
        newProject.start_date = startDate;
        newProject.end_date = endDate;
        
        try {
            await projectRepo.save(newProject);
        } catch (e) {
            res.status(202).send({ success: false });
        }

        
        res.status(200).send({ success: true });

    },

    removeProject: async (req: typeReq<strProps>, res: Response) => {

        const customUserRepo = getCustomRepository(UserRepo)
        const findUser = await customUserRepo.findEmail(req.body.email);
        if(findUser === undefined) res.status(200).send({ success: true });
        res.status(202).send({ success: false });

    },

    modifyAuthority: async (req: typeReq<strProps>, res: Response) => {
        
        const customUserRepo = getCustomRepository(UserRepo)
        const findUser = await customUserRepo.findNickName(req.body.nickname);
        if(findUser === undefined) res.status(200).send({ success: true });
        res.status(202).send({ success: false });

    },

    dashBoardInfo: async (req: typeReq<strProps>, res: Response) => {

        const customUserRepo = getCustomRepository(UserRepo)
        const { email, password } = req.body;
        const findUser = await customUserRepo.findEmail(email);
        
        if(findUser === undefined) return res.status(202).send({ 
            success: false, message: '존재하지 않는 이메일입니다' 
        });
        else if(!findUser.checkPass(password)) res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        const accToken = jwtToken.mintAccessToken(findUser.id);
        const refToken = jwtToken.mintRefreshToken(findUser.id);
        customUserRepo.saveRefToken(findUser.id, refToken);
        
        res.cookie('accessToken', accToken, { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).send({ success: true, userId: findUser.id });

    },

}

export default project;