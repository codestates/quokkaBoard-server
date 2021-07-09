import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import { User } from '@entity/User';
import { TypeReq, StrProps, StrProps2 } from '@types';


const member = {

    searchFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userRepo = getCustomRepository(UserRepo);
            // const findUser = await userRepo.findUser(`%${req.body.nickname}%`)
            // if(findUser.length === 0) throw Error;



        } catch (e) {
            res.status(202).send({
                success: false,
                message: '존재하지 않는 사용자입니다'
            })
        }
    },

    addFollower: async (req: TypeReq<StrProps2>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    },

    deleteFollower: async (req: TypeReq<StrProps2>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    },

    getFollower: async (req: TypeReq<StrProps2>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    }
}

export default member;