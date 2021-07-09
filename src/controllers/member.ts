import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import { User } from '@entity/User';
import { TypeReq, StrProps } from '@types';


const member = {

    searchFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    },

    addFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    },

    deleteFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    },

    getFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            
        } catch (e) {
            
        }
    }
}

export default member;