import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '@entity/User';
import jwtToken from '@token/jwt';



const user = {

    register: async (req: Request, res: Response) => {
        
    },

    login: async (req: Request, res: Response) => {

    },

    logout: async (req: Request, res: Response) => {
        
    },

    socialLogin: async (req: Request, res: Response) => {
        
    },

    socialInfo: async (req: Request, res: Response) => {
        
    },

    existEmail: async (req: Request, res: Response) => {
        
    },

    existNickName: async (req: Request, res: Response) => {
        
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