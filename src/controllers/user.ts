import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { User } from '@entity/User';
import { UserRepo } from '@repo/userQ';
import { TypeReq, StrProps, StrArrProps } from '@types';
import jwtToken from '@token/jwt';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import 'dotenv/config';
import { reduceEachLeadingCommentRange } from 'typescript';


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
                message: '잘못된 입력입니다' 
            });
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
                message: '사용가능한 이메일입니다' 
            });
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
                const { id, nickname, email, image }     = findUser[0];
                const accToken = jwtToken.mintAccessToken(id);
                const refToken = jwtToken.mintRefreshToken(id);
                userRepo.saveRefToken(id, refToken);
                res.cookie('accessToken', accToken, { 
                    httpOnly: true, 
                    sameSite: 'none', 
                    secure: true 
                });
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
            
        const clientID = process.env.GITHUB_CLIENT_ID as string;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET as string;
        let accessToken = '';
        // github oauth
        let userData: any = await axios({
            method: 'post',
            url: `https://github.com/login/oauth/access_token`,
            headers: {
              accept: 'application/json',
            },
            data: {
              client_id: clientID,
              client_secret: clientSecret,
              code: req.body.authorizationCode
            }
          }).then((res: any) => {
            accessToken = res.data.access_token

            let data = axios.get('https://api.github.com/user', {
                headers: {
                    authorization: `token ${accessToken}`,
                }
            })
            return data; 
        })
        
        try {  
            const data = {nickname: userData.data.login};
            const userRepo = getCustomRepository(UserRepo)
            const findUser = await userRepo.findUser(data) //id를 먼저찾음.
            
            console.log("findUser: ", findUser)

            if (findUser.length === 0) {
    
                const newUser = new User();
                newUser.email = 'socialLogin@quokka.com';
                newUser.nickname = userData.data.login;
                newUser.image = userData.data.avata_url;
                newUser.password = '';
                userRepo.save(newUser);

                return res.cookie('accessToken', accessToken, { 
                    httpOnly: true, 
                    sameSite: 'none', 
                    secure: true 
                }).status(200).send({success: true})    
            
            } else {
                res.cookie('accessToken', accessToken, { 
                    httpOnly: true, 
                    sameSite: 'none', 
                    secure: true 
                }).status(200).send({success: true})
            } 

        } catch(error) { // 유저 데이터가 존재해서 acctoken만 전달      
            res.status(202).send({ 
                success: false, 
                message: error
            });
        }
        // 1. 깃헙 이메일 주소랑 겹치는지 확인
        // 1-1. 있을 경우, 존재하는 이메일이라는 응답 보내기
        // 2. 없을 경우, db에 새로운 데이터 입력하기  
  
        // google oauth
        // axios({
        //     method: 'post',
        //     url: `https://oauth2.googleapis.com/token`,
        //     headers: {
        //         accept: 'application/json'
        //     },
        //     data: {
        //         client_id: clientID,
        //         client_secret: clientSecret,
        //         code: req.body.authorizationCode,
        //         grant_type: 'authorization_code',
        //         redirect_uri: 'https://localhost:443/user/oauth-callback'
        //     }
        // })
        // .then((res: any) => {
        //     console.log("data: ", res.data)
        // })
    
        // axios.post("https://oauth2.googleapis.com/token", {
        //     client_id: clientID,
        //     // client_secret: clientSecret,
        //     // code: req.body.authorizationCode,
        //     // grant_type: 'authorization_code',
        //     scope: "https://www.googleapis.com/auth/userinfo.email",
        //     redirect_uri: 'http://localhost:80/user/oauth-callback' // 데이터를 받아오는 API 신설
        // })
        // .then((response: any) => { 

        //     res.redirect('/oauth-callback')

        //     // console.log("respose: ", response)
        //     // const accessToken = response.data.access_token;
        //     // const refreshToken = response.data.refresh_token; 

        //     // res.send({data: response})

        //     // res.cookie('accessToken', accessToken, { 
        //     //     httpOnly: true, 
        //     //     sameSite: 'none', 
        //     //     secure: true 
        //     // });    
    
        // })
        // .catch((err: AxiosError) => {
        //     res.status(202).send({ error: err})
        // })
    
    },

    oauthCallback: async (req: TypeReq<StrArrProps>, res: Response) => {
        res.status(200).send('yeah')
    },




    // CheckAuth -> access token을 header.authorization에 날려주자
    checkAuth: async (req: TypeReq<StrArrProps>, res: Response) => {
        
        // const accessToken = req.data.access_token;

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





