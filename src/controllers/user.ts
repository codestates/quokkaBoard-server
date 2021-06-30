import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userDm';
import { User } from '@entity/User';
import jwtToken from '@token/jwt';


const user = {

    userRepo: getRepository(User), // user 테이블에서 load
    customUserRepo: getCustomRepository(UserRepo), // data mapping custom userrepo 에서 load

    register: async (req: Request, res: Response) => {
        
        const { email, nickname, password } = req.body;
        const newUser = new User();
        newUser.email = email;
        newUser.nickname = nickname;
        newUser.password = password;
        newUser.hashPass();

        try {
            await user.userRepo.save!(newUser);
        } catch (e) {
            res.status(500).send('err');
        }
        res.status(200).send({ success: true });

    },

    existEmail: async (req: Request, res: Response) => {

        const findUser = await user.customUserRepo.findEmail(req.body.email);
        if(!findUser) res.status(200).send({ success: true });
        res.status(202).send({ success: false });

    },

    existNickName: async (req: Request, res: Response) => {
        
        const findUser = await user.customUserRepo.findNickName(req.body.nickname);
        if(!findUser) res.status(200).send({ success: true });
        res.status(202).send({ success: false });

    },

    login: async (req: Request, res: Response) => {

        const { email, password } = req.body;
        const findUser = await user.customUserRepo.findEmail(email);
        
        if(!findUser) res.status(202).send({ 
            success: false, message: '존재하지 않는 이메일입니다' 
        });
        else if(!findUser.checkPass(password)) res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        

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

// app.use('/')
/* test code */
// app.get('/', (req: Request, res: Response) => {
//     res.status(200).send('Do you know quokka?')
//     // const {id, email} = req.body
//     // if(id !== 'string' || email !== 'string') res.status(202).send('not fit')
    
//     // const accessToken = mintAccessToken({id, email});
//     // const refreshToken = mintRefreshToken({id, email});
    
//     // res.cookie('Refresh Token:', refreshToken, {
//     //     httpOnly: true,
//     //     sameSite: 'none',
//     //     secure: true
//     // });
//     // res.status(200).send({data: {accessToken: accessToken}, message: 'ok'});
// }