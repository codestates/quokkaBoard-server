import express, { NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createConnection } from 'typeorm';
import ormconfig from 'ormconfig';
import 'reflect-metadata';
import 'dotenv/config';

import userRouter from '@routes/user';
import projectRouter from '@routes/project';
import kanbanRouter from '@routes/kanban';
import memberRouter from '@routes/member';
import taskRouter from '@routes/task';
import tagRouter from '@routes/tag';

const app = express();
const port = process.env.SERVER_PORT || 4000;

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: "*", 
    credentials: false,
    preflightContinue: false,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"]
}));
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/kanban', kanbanRouter);
app.use('/member', memberRouter);
app.use('/task', taskRouter);
app.use('/tag', tagRouter);
app.get('/', (req, res) => {
    res.send('Welcom quokkaBoard')
});

createConnection(ormconfig)
    .then(() => {
        console.log('ORM success DB connect!');            
        app.listen(port, () => {            
            console.log(`server listening ${port}`);
        });        
    })
    .catch(err => console.log(err)
);
