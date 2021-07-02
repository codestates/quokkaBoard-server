import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userDm';
import { User } from '@entity/User';
import { UserInfo, UserReq } from '@types';
import jwtToken from '@token/jwt';


const user = {

    register: async (req: UserReq<UserInfo>, res: Response) => {
        
        const userRepo = getRepository(User)
        const { email, nickname, password } = req.body;
        const newUser = new User();
        newUser.email = email;
        newUser.nickname = nickname!;
        newUser.password = password!;
        newUser.hashPass();

        try {
            await userRepo.save(newUser);
        } catch (e) {
            res.status(500).send('err');
        }
        res.status(200).send({ success: true });

    },

    existEmail: async (req: UserReq<UserInfo>, res: Response) => {

        const customUserRepo = getCustomRepository(UserRepo)
        const findUser = await customUserRepo.findEmail(req.body.email);
        if(findUser === undefined) res.status(200).send({ success: true });
        res.status(202).send({ success: false });

    },

    existNickName: async (req: UserReq<UserInfo>, res: Response) => {
        
        const customUserRepo = getCustomRepository(UserRepo)
        const findUser = await customUserRepo.findNickName(req.body.nickname!);
        if(findUser === undefined) res.status(200).send({ success: true });
        res.status(202).send({ success: false });

    },

    login: async (req: UserReq<UserInfo>, res: Response) => {

        const customUserRepo = getCustomRepository(UserRepo)
        const { email, password } = req.body;
        const findUser = await customUserRepo.findEmail(email);
        
        if(findUser === undefined) return res.status(202).send({ 
            success: false, message: '존재하지 않는 이메일입니다' 
        });
        else if(!findUser.checkPass(password!)) res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        const accToken = jwtToken.mintAccessToken({id: findUser.id, email: email});
        const refToken = jwtToken.mintRefreshToken({id: findUser.id, email: email });
        customUserRepo.saveRefToken(findUser.id, refToken);
        
        res.cookie('accessToken', accToken, { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).send({ success: true, userId: findUser.id });

    },

    logout: (req: UserReq<UserInfo>, res: Response) => {
        
        const customUserRepo = getCustomRepository(UserRepo)
        try {
            customUserRepo.removeRefToken(req.body.id!)
            res.status(200).clearCookie('accessToken').send({ 
                success: true, message: '로그아웃 되었습니다' 
            });
        } catch (e) { res.status(500).send('error') };
        
    },

    userInfo: async (req: UserReq<UserInfo>, res: Response) => {
        
        const customUserRepo = getCustomRepository(UserRepo);
        try {
            const findUser = await customUserRepo.findId(req.body.id!);
            if(!findUser) return res.status(202).send({ success: false, data: null });
            
            const { id, email, nickname, image, created_at, updated_at } = findUser;
            res.status(200).send({ success: true, data: {
                id, email, nickname, image, created_at, updated_at
            }});
        } catch (e) { res.status(500).send('error') };

    },

    socialLogin: async (req: Request, res: Response) => {
        
    },

    socialInfo: async (req: Request, res: Response) => {
        
    },

}

export default user;
