import { RequestHandler, Request, Response, NextFunction } from 'express';

export const errorHandler = (handler: RequestHandler) => 
    (...args: [Request, Response, NextFunction]) => handler(...args)