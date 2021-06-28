import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Request, Response } from 'express';
import { mintAccessToken, mintRefreshToken } from 'token/jwt';
import 'dotenv/config';


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

/////////////////   server test  /////////////////////////

app.post('/user/login', (req: Request, res: Response) => {
    console.log('Hello TypeScript!')
    
    const {id, email} = req.body
    if(id !== 'string' || email !== 'string') res.status(202).send('not fit')
    
    const accessToken = mintAccessToken({id, email});
    const refreshToken = mintRefreshToken({id, email});
    
    res.cookie('Refresh Token:', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.status(200).send({data: {accessToken: accessToken}, message: 'ok'});
});

// const certKey = fs.readFileSync(__dirname + "/cert.pem", "utf-8");
// const privKey = fs.readFileSync(__dirname + "/key.pem", "utf-8");
// const asymmetricKey = { key: privKey, cert: certKey };

// let server = https.createServer(asymmetricKey, app)
// .listen(port, () => console.log(`server listening on ${port}`))

/////////////////////////////////////////////////////////


app.listen(port, () => {
    console.log(`server listening ${port}`);
});
