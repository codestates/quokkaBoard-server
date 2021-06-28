import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Request, Response } from 'express';
// import { generateAccessToken, generateRefreshToken } from 'util/token';

const app = express();
const port = 4000;

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"]
}))

//////////////////////////////////////// https server test
// let console: Console

// app.post('/user/login', (req: Request, res: Response) => {
//     console.log('Hello TypeScript!')
    
//     const {id, email} = req.body
//     if(id !== 'number' || email !== 'string') res.status(202).send('not fit')
    
//     const accessToken = generateAccessToken({id, email});
//     const refreshToken = generateRefreshToken({id, email});
    
//     res.cookie('Refresh Token:', refreshToken, {
//         httpOnly: true,
//         sameSite: 'none',
//         secure: true
//     });
//     res.status(200).send({data: {accessToken: accessToken}, message: 'ok'});
// });
////////////////////////////////////////

app.listen(port, () => {
    console.log(`server listening ${port}`);
});

module.exports = app;