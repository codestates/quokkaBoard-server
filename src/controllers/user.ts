import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { User } from '@entity/User';
import { UserRepo } from '@repo/userQ';
import { TypeReq, StrProps, StrArrProps } from '@types';
import jwtToken from '@token/jwt';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";


const user = {

    register: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { email, nickname, password } = req.body;
            if(!password) throw new Error('pass');
            
            const userRepo = getRepository(User);
            const newUser = new User();
            newUser.email = email;
            newUser.nickname = nickname;
            newUser.password = password;
            newUser.hashPass();
            await userRepo.save(newUser);
            
            res.status(200).send({ success: true });
        } catch (e) {
            e.message === 'pass'
            ? res.status(202).send({ 
                success: false, 
                message: '잘못된 입력입니다' 
            })
            : res.status(500).send('server error')
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
                const { id, nickname, email, image } = findUser[0];
                const accToken = jwtToken.mintAccessToken(id);
                const refToken = jwtToken.mintRefreshToken(id);
                await userRepo.saveRefToken(id, refToken);
                
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





