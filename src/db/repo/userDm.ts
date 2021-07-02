import { EntityRepository, IsNull, Repository } from 'typeorm';
import { User } from '@entity/User';

@EntityRepository()
export class UserRepo extends Repository <User> {
    findId(id: string) {
        return this.createQueryBuilder("user")
        .where("user.email = :email", { id })
        .getOne();
    }
    
    findEmail(email: string) {
        return this.createQueryBuilder("user")
        .where("user.email = :email", { email })
        .getOne();
    }
    
    findNickName(nickname: string) {
        return this.createQueryBuilder("user")
        .where("user.nickname = :nickname", { nickname })
        .getOne();
    }

    saveRefToken(id: string, refToken: string) {
        return this.createQueryBuilder("user")
        .update(User)
        .set({ refresh_token: refToken })
        .where("user.id = :id", { id })
    }

    removeRefToken(id: string) {
        return this.createQueryBuilder("user")
        .update(User)
        .set({ refresh_token: null! })
        .where("user.id = :id", { id })
    }
}