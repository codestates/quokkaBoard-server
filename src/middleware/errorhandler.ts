import { RequestHandler, Request, Response, NextFunction } from 'express';

export const errorHandler = (handler: RequestHandler) => 
    (...args: [Request, Response, NextFunction]) => handler(...args)

// app.use((req, res, next) => {
//     res.status(404).send("요청을 찾을 수 없습니다.")
// });
// app.use((err: Error, req: Request, res: Response) => {
//     console.error(err.stack)
//     res.status(500).send("server error")
// });