import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import { User } from '@entity/User';
import { typeReq, strProps } from '@types';
import jwtToken from '@token/jwt';


const modify = {

    nickname: (req: typeReq<strProps>, res: Response) => {
        
        const customUserRepo = getCustomRepository(UserRepo)
        const { userId, nickname } = req.body;
        try {
            customUserRepo.modifyNickName(userId, nickname)
            res.status(200).send({ success: true }); 
        } catch (e) {
            res.status(204).send({ 
                success: false, message: '잘못된 유저 정보 입니다' 
            });
        }
        
    },

    password: async (req: typeReq<strProps>, res: Response) => {

        const userRepo = getRepository(User)
        const { userId, password, newpassword } = req.body;
        const findUser = await userRepo.findOne({where: {id: userId}})
        
        if(!findUser) return res.status(204).send({ 
            success: false, message: '잘못된 유저 정보 입니다'
        });
        else if(!findUser.checkPass(password)) return res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        findUser.password = newpassword;
        findUser.hashPass();
        userRepo.save(findUser)
        res.status(200).send({success: true})

    },

    image: async (req: typeReq<strProps>, res: Response) => {
        

    },

    deleteUser: async (req: typeReq<strProps>, res: Response) => {

        const userRepo = getRepository(User);
        try {
            userRepo.delete({ id: req.body.userId }); // 동기처리 전에 response가 이뤄짐.
            res.status(200).clearCookie('accessToken').send({ success: true });
        } catch (e) {
            res.status(202).send({ success: false, message: e });// 클라이언트 쪽에서 핸들링이 되면 400으로 변경
        }

    },
}

export default modify;