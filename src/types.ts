import { Request } from 'express';

export interface TypeReq<T> extends Request {
    body: T
}

export interface StrProps {
    [key: string]: string;
}

export interface StrArrProps {
    [key: string]: string | string[];
}

export interface InviteUser {
    nickname: string[];
    projectId: string;
}

export interface StrNumProps {
    [key: string]: string | number;
}

export interface TaskProps {
    taskId: number;
    [key: string]: string | number;
}