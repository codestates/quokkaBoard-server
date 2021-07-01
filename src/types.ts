import { Request } from 'express';

export interface UserInfo {
    email: string;
    id?: string;
    name?: string;
    role?: string;
    nickname?: string;
    password?: string;
    image?: Blob;
}

export interface UserReq<T> extends Request {
    body: T
}
