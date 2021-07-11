import { Request, Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { User } from '@entity/User';
import { UserRepo } from '@repo/userQ';
import { TypeReq, StrProps, StrArrProps } from '@types';
import jwtToken from '@token/jwt';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";


const user = {

    register: (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { email, nickname, password } = req.body;
            if(!password) throw Error;
            
            const userRepo = getRepository(User);
            const newUser = new User();
            newUser.email = email;
            newUser.nickname = nickname;
            newUser.password = password;
            newUser.hashPass();
            userRepo.save(newUser);
            
            res.status(200).send({ success: true });
        } catch (e) {
            res.status(202).send({ 
                success: false, 
                message: '잘못된 입력입니다' });
        } 
    },

    existEmail: async (req: TypeReq<StrArrProps>, res: Response) => {
        try{
            const userRepo = getCustomRepository(UserRepo)
            const findUser = await userRepo.findUser(req.body);
            if(findUser.length === 0) throw Error;
            
            res.status(200).send({ 
                success: true,
                message: '존재하는 이메일입니다'
            });
        } catch (e) {
            res.status(202).send({ 
                success: false, 
                message: '사용가능한 이메일입니다' });
        }
    },

    existNickName: async (req: TypeReq<StrArrProps>, res: Response) => {
        try{
            const userRepo = getCustomRepository(UserRepo)
            const findUser = await userRepo.findUser(req.body);
            if(findUser.length === 0) throw Error;
            
            res.status(200).send({ 
                success: true,
                message: '존재하는 닉네임입니다'
            });
        } catch (e) {
            res.status(202).send({ 
                success: false,
                message: '사용가능한 닉네임입니다'
            });
        }
    },

    login: async (req: TypeReq<StrArrProps>, res: Response) => {
        try {
            const userRepo = getCustomRepository(UserRepo);
            const findUser = await userRepo.findUser(req.body);
            
            if(findUser.length === 0) throw new Error('id');
            if(!findUser[0].checkPass(req.body.password as string))
            throw new Error('password');
            else {
                const { id, nickname, email, image } = findUser[0];
                const accToken = jwtToken.mintAccessToken(id);
                const refToken = jwtToken.mintRefreshToken(id);
                userRepo.saveRefToken(id, refToken);
                // res.cookie('accessToken', accToken, { 
                //     httpOnly: true, 
                //     sameSite: 'none', 
                //     secure: true 
                // });
                res.status(200).send({ 
                    success: true, 
                    data: { id, nickname, email, image }
                });
            }
        } catch (e) {
            if(e.message === 'id') res.status(202).send({
                success: false, 
                message: '존재하지 않는 이메일입니다'
            });
            if (e.message === 'password') res.status(202).send({
                success: false, 
                message: '비밀번호가 일치하지 않습니다'
            });
            else res.status(500).send('server error');
        }
    },

    logout: (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userRepo = getCustomRepository(UserRepo);
            userRepo.saveRefToken(req.body.userId, null);

            res.status(200).clearCookie('accessToken').send({ 
                success: true, 
                message: '로그아웃 되었습니다' 
            });
        } catch (e) { 
            res.status(500).send('error');
        }
    },

    userInfo: async (req: TypeReq<StrArrProps>, res: Response) => {
        try {           
            const userRepo = getCustomRepository(UserRepo);
            const findUser = await userRepo.findUser(req.body);
            if(findUser.length === 0) throw Error;
            const { 
                id, email, nickname, image, 
                created_at, updated_at 
            } = findUser[0];

            res.status(200).send({ 
                success: true, 
                data: { 
                    id, email, nickname, image, 
                    created_at, updated_at 
                }
            });
        } catch (e) { 
            res.status(202).send({ 
                success: false, 
                message: '잘못된 유저 정보입니다'
            });
        }
    },

    

    socialLogin: async (req: TypeReq<StrArrProps>, res: Response) => {
            
        const clientID = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const userRepo = getCustomRepository(UserRepo)
        // const findUser = userRepo.findUser(req.body)

        axios.post("https://oauth2.googleapis.com/token", {
            client_id: clientID,
            client_secret: clientSecret,
            code: req.body.authorizationCode,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:4000/user/oauth-callBack' // 데이터를 받아오는 API 신설
        })
        .then((response: AxiosResponse) => { 
            const accessToken = response.data.access_token;
            const refreshToken = response.data.refresh_token; 

            // 구글 api에 정보 찾아오는 axios를 날려주자.

            res.cookie('accessToken', accessToken, { 
                httpOnly: true, 
                sameSite: 'none', 
                secure: true 
            });    
    
        })
        .catch((err: AxiosError) => {
            res.status(202).send({ error: err})
        })
    
    },


    // CheckAuth -> access token을 header.authorization에 날려주자
    checkAuth: async (req: TypeReq<StrArrProps>, res: Response) => {
        
        // const accessToken = req.data.=access_token;

        // axios({
        //     method:'get',
        //     url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        //     headers: {Authorization: "Bearer " + accessToken} 
        // })
        // .then(userData: any => {
        //     res.status(200).send({
        //         success: true, 
        //         data: {
        //             "email": userData.email,
        //             "picture": userData.picture,
        //             "nickname":userData.name, // 닉네임 가능여부 체크
        //             "id": userData.id
        //         }
        //     })
        //     .catch((err: AxiosError) => {
        //         res.status(202).send({ error: err})
        //     })
        // })
    },
}

export default user;





