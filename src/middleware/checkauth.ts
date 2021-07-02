import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepo } from '@repo/userDm';
import jwtToken from '@token/jwt';
import 'dotenv/config';


export const checkAuthority = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers.authorization;
    if (auth === undefined) return res.status(400).send({
        success: false, message: '로그인 상태가 아닙니다'
    });

    const accPayload = jwtToken.checkAccToken(auth);// 
    const customUserRepo = getCustomRepository(UserRepo);
    const findUser = await customUserRepo.findId(accPayload?.id!)
    const refPayload = jwtToken.checkRefToken(findUser?.refresh_token!);

    if(accPayload) next();
    else {
        if(refPayload) {
            const accToken = jwtToken.mintAccessToken({
                id: findUser?.id, email: findUser?.email!
            });
            res.cookie('accessToken', accToken, { 
                httpOnly: true, sameSite: 'none', secure: true 
            });
            next();
        } else {
            res.status(202).send({ success: false, message: '다시 로그인해 주십시오' });
        }
    }
}