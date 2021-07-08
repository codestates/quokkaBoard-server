import { Request } from 'express';

export interface TypeReq<T> extends Request {
    body: T
}

export interface StrProps {
    [key: string]: string;
}

export interface InviteUser {
    nickname: string[];
    projectId: string;
}

export interface BoardProps {
    [key: string]: string | number;
}