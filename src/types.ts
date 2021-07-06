import { Request } from 'express';


export interface strProps {
    [key: string]: string;
}

export interface boardProps {
    [key: string]: string | number;
}

export interface typeReq<T> extends Request {
    body: T
}
