import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { StrProps, StrArrProps } from '../../types';


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
        .where("user.id = :id", {id: data.userId})
        .orWhere("user.email like :email", {email: `%${data.email}%`})
        .orWhere("user.nickname like :nickname", {nickname: `%${data.nickname}%`})
        .getMany();
    }

    findUserAuth(email: string) {
        return this
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.user_project", "users")
        .select([
            "user.id AS userId",
            "user.email AS email",
            "user.nickname AS nickname",
            "user.image AS image",
            "users.authority AS authority",
            "users.projectId AS projectId"
        ])
        .where({email: email})
        .getRawMany();
    }

    findMemberInUser(data: StrArrProps) {
        return this
        .createQueryBuilder("user")
        .innerJoin("user.user_project", "usr")
        .select(["user.nickname"])
        .where("nickname IN (:nickname)", {
            nickname: data.nickname
        })
        .andWhere("usr.projectId = :projectId", {
            projectId: data.projectId
        })
        .getRawMany();
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