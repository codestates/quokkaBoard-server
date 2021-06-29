/* Index setting */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

/* Routers */


/* DB connect */
const config = require('@ormconfig')
createConnection(config)
    .then(() => {
        console.log('ORM success DB connect!')
    })
    .catch(err => console.log(err));

/* Express setting */
const app = express();
const port = process.env.SERVER_PORT || 4000;

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"]
}));

// app.use('/')
/* test code */
// app.get('/', (req: Request, res: Response) => {
//     res.status(200).send('Do you know quokka?')
//     // const {id, email} = req.body
//     // if(id !== 'string' || email !== 'string') res.status(202).send('not fit')
    
//     // const accessToken = mintAccessToken({id, email});
//     // const refreshToken = mintRefreshToken({id, email});
    
//     // res.cookie('Refresh Token:', refreshToken, {
//     //     httpOnly: true,
//     //     sameSite: 'none',
//     //     secure: true
//     // });
//     // res.status(200).send({data: {accessToken: accessToken}, message: 'ok'});
// }

///////////////////////* local https test *///////////////////////////////
//                                                                      //
// const certKey = fs.readFileSync(__dirname + "/cert.pem", "utf-8");   //
// const privKey = fs.readFileSync(__dirname + "/key.pem", "utf-8");    //
// const asymmetricKey = { key: privKey, cert: certKey };               //
//                                                                      //
// let server = https.createServer(asymmetricKey, app)                  //
// .listen(port, () => console.log(`server listening on ${port}`))      //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

/* Server connect */
app.listen(port, () => {
    console.log(`server listening ${port}`);
});
