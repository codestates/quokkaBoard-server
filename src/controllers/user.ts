import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import { User } from '@entity/User';
import { typeReq, strProps } from '@types';
import jwtToken from '@token/jwt';


const user = {

    register: (req: typeReq<strProps>, res: Response) => {
        
        const userRepo = getRepository(User)
        const { email, nickname, password } = req.body;
        const newUser = new User();
        newUser.email = email;
        newUser.nickname = nickname;
        newUser.password = password;
        newUser.hashPass();

        try {
            userRepo.save(newUser);
            res.status(200).send({ success: true });
        } catch (e) {
            res.status(500).send('err');
        }

    },

    existEmail: (req: typeReq<strProps>, res: Response) => {
        
        const userRepo = getCustomRepository(UserRepo)
        try{
            userRepo.findEmail(req.body.email);
            res.status(202).send({ success: false });
        } catch (e) {
            res.status(200).send({ success: true });
        }

    },

    existNickName: (req: typeReq<strProps>, res: Response) => {
        
        const userRepo = getCustomRepository(UserRepo)
        try {
            userRepo.findNickName(req.body.nickname);
            res.status(202).send({ success: false });
        } catch (e) {
            res.status(200).send({ success: true });
        }

    },

    login: async (req: typeReq<strProps>, res: Response) => {

        const userRepo = getCustomRepository(UserRepo)
        const { email, password } = req.body;
        const findUser = await userRepo.findEmail(email);
        
        if(!findUser) return res.status(202).send({ 
            success: false, message: '존재하지 않는 이메일입니다' 
        });
        else if(!findUser.checkPass(password)) res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        // const accToken = jwtToken.mintAccessToken(findUser.id);
        // const refToken = jwtToken.mintRefreshToken(findUser.id);
        // customUserRepo.saveRefToken(findUser.id, refToken);
        // res.cookie('accessToken', accToken, { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).send({ success: true, userId: findUser.id });

    },

    logout: (req: typeReq<strProps>, res: Response) => {
        
        const userRepo = getCustomRepository(UserRepo)
        try {
            userRepo.removeRefToken(req.body.userId)
            res.status(200).clearCookie('accessToken').send({ 
                success: true, message: '로그아웃 되었습니다' 
            });
        } catch (e) { 
            res.status(500).send('error') 
        };
        
    },

    userInfo: async (req: typeReq<strProps>, res: Response) => {
                          
        const userRepo = getCustomRepository(UserRepo);
        try {
            const findUser = await userRepo.findId(req.body.userId);
            const { id, email, nickname, image, created_at, updated_at } = findUser;

            res.status(200).send({ success: true, data: {
                id, email, nickname, image, created_at, updated_at
            }});
        } catch (e) { 
            res.status(202).send({ success: false, data: null });
        };

    },

    socialLogin: async (req: Request, res: Response) => {
        
    },

    socialInfo: async (req: Request, res: Response) => {
        
    },

}

export default user;





