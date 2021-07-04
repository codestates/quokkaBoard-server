import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userDm';
import { User } from '@entity/User';
import { typeReq, strProps } from '@types';
import jwtToken from '@token/jwt';


const modify = {

    nickname: (req: typeReq<strProps>, res: Response) => {
        
        const customUserRepo = getCustomRepository(UserRepo)
        const { id, nickname } = req.body;
        try {
            customUserRepo.modifyNickName(id, nickname)
        } catch (e) {
            res.status(204).send({ 
                success: false, message: '잘못된 유저 정보 입니다' 
            });
        }
        res.status(200).send({ success: true });

    },

    password: async (req: typeReq<strProps>, res: Response) => {

        const customUserRepo = getCustomRepository(UserRepo)
        const { id, password, newpassword } = req.body;
        const findUser = await customUserRepo.findId(id);
        
        if(findUser === undefined) return res.status(204).send({ 
            success: false, message: '잘못된 유저 정보 입니다'
        });
        else if(!findUser.checkPass(password)) res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        customUserRepo.modifyPassword(findUser.id, newpassword);
        findUser.hashPass();

    },

    image: async (req: typeReq<strProps>, res: Response) => {
        

    },

    deleteUser: async (req: typeReq<strProps>, res: Response) => {

        const userRepo = getRepository(User);
        try {
            await userRepo.delete({ id: req.body.id });
        } catch (e) {
            res.status(202).send({ success: false, message: e });// 클라이언트 쪽에서 핸들링이 되면 400으로 변경
        }
        res.status(200).clearCookie('accessToken').send({ success: true });

    },
}

export default modify;