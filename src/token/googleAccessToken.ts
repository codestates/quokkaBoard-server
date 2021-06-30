import { Request, Response } from 'express';
import 'dotenv/config';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";


export const googleAccessToken = (req: Request, res: Response) => {
    
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    //구글한테 access_token을 받아오자. 
    axios({ 
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/auth',
        headers: {
            accept: 'application/json',
        },
        data: {
            client_id: clientID,
            client_secret: clientSecret,
            code: req.body.authorizationCode, // 클라이언트로부터 받는 authorization code 
            redirect_uri: 'https://localhost:4000/oauth', // 유저 데이터를 전달받을 url로 수정할 것.
            grant_type: 'authorization_code'
        }
      })
      .then((response: AxiosResponse) => { // access_token은 클라로 쏴주자.
          let accessToken = response.data.access_token;
          res.status(200).send({ success: true, data: {accessToken: accessToken }})
      })
      .catch((err: AxiosError) => {
          res.status(202).send({ error: err})
    })
}