import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const app = express();
const port = 443;

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"]
}))

let console: Console

app.get('/', (req, res) => {
    console.log('Hello TypeScript!')
    res.send('Hello TypeScript!');
});

app.listen(port, () => {
    console.log(`server listening ${port}`);
});

module.exports = app;