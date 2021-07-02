import { Request } from 'express';

export interface UserInfo {
    email: string;
    id?: string;
    name?: string;
    role?: string;
    nickname?: string;
    password?: string;
    image?: Blob;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserReq<T> extends Request {
    body: T
}
