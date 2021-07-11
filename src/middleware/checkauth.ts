import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepo } from '@repo/userQ';
import jwtToken from '@token/jwt';
import 'dotenv/config';


export const checkAuthority = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers.authorization;
    if(!auth) return res.status(400).send({
        success: false, message: '로그인 상태가 아닙니다'
    });
    const token = auth.split(" ")[1];
    const accPayload = jwtToken.checkAccToken(token);
    
    if(accPayload) next();
    else {
        const expPayload = jwtToken.checkExpToken(token);
        const customUserRepo = getCustomRepository(UserRepo);
        const findUser = await customUserRepo.findId(expPayload.id)
        if(!findUser) return res.status(401).send({
            success: false, message: '인증된 사용자가 아닙니다'
        });

        const refPayload = jwtToken.checkRefToken(findUser.refresh_token!);
        if(refPayload) {
            const accToken = jwtToken.mintAccessToken(findUser.id);
            res.cookie('accessToken', accToken, { 
                httpOnly: true, sameSite: 'none', secure: true 
            });
            next();
        } else {
            res.status(202).send({ 
                success: false, message: '다시 로그인해 주십시오' 
            });
        }
    }
}
