import { EntityRepository, Repository } from 'typeorm';
import { User } from '@entity/User';

@EntityRepository()
export class UserRepo extends Repository <User> {
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

}