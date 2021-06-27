import express from 'express';

const app = express();
const port = 4000;

let console: Console

app.get('/', (req, res) => {
    console.log('Hello TypeScript!')
    res.send('Hello TypeScript!');
});

app.listen(port, () => {
    console.log(`server listening ${port}`);
});

module.exports = app;