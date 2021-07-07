import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import { User } from '@entity/User';
import { typeReq, strProps } from '@types';
import jwtToken from '@token/jwt';


const modify = {

    nickname: (req: typeReq<strProps>, res: Response) => {
        
        const userRepo = getCustomRepository(UserRepo)
        const { userId, nickname } = req.body;
        try {
            userRepo.modifyNickName(userId, nickname)
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
        const findUser = await userRepo.findOne({where: {id: userId}}) // id가 일치하는 정보를 담은 인스턴스를 뱉어냄.
        
        if(!findUser) return res.status(204).send({ 
            success: false, message: '잘못된 유저 정보 입니다'
        });
        else if(!findUser.checkPass(password)) res.status(202).send({ 
            success: false, message: '비밀번호가 일치하지 않습니다' 
        });

        findUser.password = newpassword;
        findUser.hashPass();
        userRepo.save(findUser) // instance를 생성하고 나서는 useRepo에 저장해주자.
        res.status(200).send({success: true})
        // 토큰 무효화 하고 refresh 로직 추가
    },

    image: async (req: typeReq<strProps>, res: Response) => {
        

    },

    deleteUser: async (req: typeReq<strProps>, res: Response) => {

        const userRepo = getRepository(User);
        try {
            userRepo.delete({ id: req.body.userId });
            res.status(200).clearCookie('accessToken').send({ success: true });
        } catch (e) {
            res.status(202).send({ success: false, message: e });
        }
        // 프로젝트 마스터 권한일 경우 권한이양 로직 추가
    },
}

export default modify;