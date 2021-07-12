import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { StrProps, StrArrProps } from '@types';


@EntityRepository(User)
export class UserRepo extends Repository <User> {
    
    findUser(data: StrArrProps) {
        return this
        .createQueryBuilder("user")
        .where("id IN (:id)", {id: data.userId})
        .orWhere("email IN (:email)", {email: data.email})
        .orWhere("nickname IN (:nickname)", {nickname: data.nickname})
        .getMany();
    }

    searchUser(data: StrProps) {
        return this
        .createQueryBuilder("user")
        .select([
            'user.id', 
            'user.email', 
            'user.nickname', 
            'user.image'
        ])
        .where("user.id = :id", {id: data.followerId})
        .orWhere("user.email like :email", {email: `%${data.email}%`})
        .orWhere("user.nickname like :nickname", {nickname: `%${data.nickname}%`})
        .getMany();
    }

    findUserAuth(email: string) {
        return this
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.user_project", "users")
        .where({email: email})
        .getRawMany();
    }

    modifyNickName(id: string, nickname: string) {
        return this
        .createQueryBuilder("user")
        .update(User)
        .set({nickname: nickname})
        .where({id: id})
        .execute();
    }

    modifyPassword(id: string, password: string) {
        return this
        .createQueryBuilder("user")
        .update(User)
        .set({password: password})
        .where({id: id})
        .execute();
    }

    saveRefToken(id: string, refToken: string | null) {
        return this
        .createQueryBuilder("user")
        .update(User)
        .set({refresh_token: refToken!})
        .where({id: id})
        .execute();
    }

}