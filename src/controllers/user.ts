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
        
        
        res.cookie('accessToken', accToken, { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).send({ success: true, userId: findUser.id });

    },

    logout: async (req: Request, res: Response) => {
        
    },

    socialLogin: async (req: Request, res: Response) => {
        
    },

    socialInfo: async (req: Request, res: Response) => {
        
    },

    userInfo: async (req: Request, res: Response) => {
        
    },
}

export default user;

// // app.use('/')
// /* test code */
// // app.get('/', (req: Request, res: Response) => {
// //     res.status(200).send('Do you know quokka?')
// //     // const {id, email} = req.body
// //     // if(id !== 'string' || email !== 'string') res.status(202).send('not fit')
    
// //     // const accessToken = mintAccessToken({id, email});
// //     // const refreshToken = mintRefreshToken({id, email});
    
// //     // res.cookie('Refresh Token:', refreshToken, {
// //     //     httpOnly: true,
// //     //     sameSite: 'none',
// //     //     secure: true
// //     // });
// //     // res.status(200).send({data: {accessToken: accessToken}, message: 'ok'});
// // }