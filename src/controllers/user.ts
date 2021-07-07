import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { User } from '@entity/User';
import { UserRepo } from '@repo/userQ';
import { TypeReq, StrProps } from '@types';
import jwtToken from '@token/jwt';


const user = {

    register: (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { 
                email, 
                nickname, 
                password 
            } = req.body;
            if(!password) throw new Error();
            
            const userRepo = getRepository(User);
            const newUser = new User();
            newUser.email = email;
            newUser.nickname = nickname;
            newUser.password = password;
            newUser.hashPass();
            userRepo.save(newUser);
            
            res.status(200).send({ success: true });
        } catch (e) {
            res.status(202).send({ 
                success: false, 
                message: '잘못된 입력입니다' });
        } 
    },

    existEmail: async (req: TypeReq<StrProps>, res: Response) => {
        try{
            const userRepo = getCustomRepository(UserRepo)
            const findUser = await userRepo.findEmail(req.body.email);
            if(!findUser) throw new Error();

            res.status(200).send({ 
                success: true,
                message: '존재하는 이메일입니다'
            });
        } catch (e) {
            res.status(202).send({ 
                success: false, 
                message: '사용가능한 이메일입니다' });
        }
    },

    existNickName: async (req: TypeReq<StrProps>, res: Response) => {
        try{
            const userRepo = getCustomRepository(UserRepo)
            const findUser = await userRepo.findNickName(req.body.nickname);
            if(!findUser) throw new Error();
            
            res.status(200).send({ 
                success: true,
                message: '존재하는 닉네임입니다'
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '사용가능한 닉네임입니다'
            });
        }
    },

    login: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            let userId: string;
            const { 
                email, 
                password 
            } = req.body;
            const userRepo = getCustomRepository(UserRepo);
            const findUser = await userRepo.findEmail(email);
            
            if(!findUser) throw new Error('id');
            if(!findUser.checkPass(password)) throw new Error('password');
            else {
                userId = findUser.id;
                const accToken = jwtToken.mintAccessToken(userId);
                const refToken = jwtToken.mintRefreshToken(userId);
                userRepo.saveRefToken(userId, refToken);
                // res.cookie('accessToken', accToken, { 
                //     httpOnly: true, 
                //     sameSite: 'none', 
                //     secure: true 
                // });
                res.status(200).send({ 
                    success: true, 
                    userId: userId
                });
            }
        } catch (e) {
            if(e.message === 'id') res.status(202).send({
                success: false, 
                message: '존재하지 않는 이메일입니다'
            });
            if (e.message === 'password') res.status(202).send({
                success: false, 
                message: '비밀번호가 일치하지 않습니다'
            });
            else res.status(500).send('server error');
        }
    },

    logout: (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userRepo = getCustomRepository(UserRepo);
            userRepo.saveRefToken(req.body.userId, null);

            res.status(200).clearCookie('accessToken').send({ 
                success: true, 
                message: '로그아웃 되었습니다' 
            });
        } catch (e) { 
            res.status(500).send('error');
        }
    },

    userInfo: async (req: TypeReq<StrProps>, res: Response) => {
        try {           
            const userRepo = getCustomRepository(UserRepo);
            const findUser = await userRepo.findId(req.body.userId);
            const { 
                id, email, 
                nickname, 
                image, 
                created_at, 
                updated_at 
            } = findUser;

            res.status(200).send({ 
                success: true, 
                data: {
                    id, email, 
                    nickname, 
                    image, 
                    created_at, 
                    updated_at
                }
            });
        } catch (e) { 
            res.status(202).send({ 
                success: false, 
                message: '인증된 사용자가 아닙니다'
            });
        }
    },

    socialLogin: async (req: Request, res: Response) => {
        
    },

    socialInfo: async (req: Request, res: Response) => {
        
    },

}

export default user;





