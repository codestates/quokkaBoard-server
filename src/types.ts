import { Request } from 'express';

export interface TypeReq<T> extends Request {
    body: T
}

export interface StrProps {
    [key: string]: string;
}

export interface NumProps {
    [key: string]: number;
}

export interface StrArrProps {
    [key: string]: string | string[];
}

export interface StrNumProps {
    [key: string]: string | number;
}

export interface InviteUser {
    nickname: string[];
    projectId: string;
}

export interface TaskProps {
    taskId: string;
    projectId?: string;
    tagId?: number;
    [key: string]: any;
}

export interface ShiftProps {
    boardId: string;
    targetId: string;
    cIdx: number;
    targetIdx: number;
}
