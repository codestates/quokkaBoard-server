import { Request } from 'express';

export interface strProps {
    [key: string]: string
}

export interface typeReq<T> extends Request {
    body: T
}