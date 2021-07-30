import { Response } from 'express'
import { getRepository, getCustomRepository } from 'typeorm'
import { User } from '../db/entity/User'
import { UserRepo } from '../db/repo/userQ'
import jwtToken from '../token/jwt'
import { TypeReq, StrProps, StrArrProps } from '../types'


const modify = {

    nickname: async (req: TypeReq<StrArrProps>, res: Response) => {
        try {
            let { nickname } = req.body;
            const userRepo = getCustomRepository(UserRepo);
            delete req.body.nickname;

            const findUser = await userRepo.findUser(req.body);
            const findNickName = await userRepo.findOne(
                {where: {nickname: nickname}
            });
            if(findUser.length === 0 || findNickName) throw new Error('user');
            if(nickname.length === 0) nickname = findUser[0].nickname;
            
            await userRepo.createQueryBuilder("user")
                .update(User)
                .set({nickname: nickname as string})
                .where({id: findUser[0].id})
                .execute();

            res.status(200).send({ success: true });
        } catch (e) {
            e.message === 'user'
            ? res.status(202).send({ 
                success: false, 
                message: '잘못된 요청입니다' 
            })
            : res.status(202).send('server error');
        }
    },

    password: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { userId, password, newpassword } = req.body;
            const userRepo = getCustomRepository(UserRepo);
            const findUser = await userRepo.findOne({where: {id: userId}});

            if(!findUser) throw new Error('id');
            if(!findUser.checkPass(password)) throw new Error('password');
            else {
                findUser.password = newpassword;
                findUser.hashPass();
                await userRepo.save(findUser);

                const accToken = jwtToken.mintAccessToken(userId);
                const refToken = jwtToken.mintRefreshToken(userId);
                await userRepo.saveRefToken(userId, refToken);
                
                res.clearCookie('accessToken');
                res.cookie('accessToken', accToken, { 
                    httpOnly: true, 
                    sameSite: 'none', 
                    secure: true 
                });
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
