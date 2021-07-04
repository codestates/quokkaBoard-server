/* Module setting */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import 'dotenv/config';
import { User } from './db/entity/User'

/* Routers */
import userRouter from './routes/user'

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

/* API routing */   
app.use('/user', userRouter);


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

/* DB & Server connect */
createConnection() 
    // .then(async connection => {


    //     await connection.manager.save(user); // manager는 connection 다음에 

    // })
    .then(() => {
        console.log('ORM success DB connect!');            
        app.listen(port, () => {            
            console.log(`server listening ${port}`);
        });        
    })
    .catch(err => console.log(err)
);
