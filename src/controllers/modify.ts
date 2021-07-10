import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import { User } from '@entity/User';
import { TypeReq, StrProps, StrArrProps } from '@types';
import jwtToken from '@token/jwt';


const modify = {

    nickname: async (req: TypeReq<StrArrProps>, res: Response) => {
        try {
            const { nickname } = req.body
            delete req.body.nickname;
            const userRepo = getCustomRepository(UserRepo);
            
            const findUser = await userRepo.findUser(req.body);
            if(findUser.length === 0) throw Error;
            userRepo.modifyNickName(findUser[0].id, nickname as string);

            res.status(200).send({ success: true }); 
        } catch (e) {
            res.status(202).send({ 
                success: false, 
                message: '잘못된 유저 정보입니다' 
            });
        }
    },

    password: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { userId, password, newpassword } = req.body;
            const userRepo = getRepository(User);
            const findUser = await userRepo.findOne({where: {id: userId}})

            if(!findUser) throw new Error('id');
            if(!findUser.checkPass(password)) throw new Error('password');
            else {
                findUser.password = newpassword;
                findUser.hashPass();
                userRepo.save(findUser);
                // 토큰 무효화 하고 refresh 로직 추가
                res.status(200).send({success: true})
            }
        } catch (e) {
            if(e.message === 'id') res.status(202).send({
                success: false, 
                message: '잘못된 유저 정보입니다'
            });
            if (e.message === 'password') res.status(202).send({
                success: false, 
                message: '비밀번호가 일치하지 않습니다'
            });
            else res.status(500).send('server error');
        }
    },

    deleteUser: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userRepo = getRepository(User);
            const findUser = await userRepo.findOne({where: {id: req.body.userId}});
            if(!findUser) throw Error;
            // 프로젝트 마스터 권한일 경우 권한이양 로직 추가
            userRepo.delete({ id: req.body.userId });
            res.status(200).clearCookie('accessToken').send({ success: true });
        } catch (e) {
            res.status(202).send({ 
                success: false, 
                message: '잘못된 유저 정보입니다'
            });
        }
    },

    image: async (req: TypeReq<StrProps>, res: Response) => {
        
    }
}

export default modify;
