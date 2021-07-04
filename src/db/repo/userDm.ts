import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User) // 이용하는 entity class를 인자로 넣어주자. => 여러개의 인자를 가질 수 있는지 test 요망.
export class UserRepo extends Repository <User> {
    
    findId(id: string) {
        return this.createQueryBuilder("user")
        .where("user.id = :id", { id })
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

    modifyNickName(id: string, nickname: string) {
        return this.createQueryBuilder("user")
        .update(User)
        .set({ nickname: nickname })
        .where("user.id = :id", { id })
        .execute();
    }

    modifyPassword(id: string, password: string) {
        return this.createQueryBuilder("user")
        .update(User)
        .set({ password: password })
        .where("user.id = :id", { id })
        .execute();
    }

    // saveRefToken(id: string, refToken: string) {
    //     return this.createQueryBuilder("user")
    //     .update(User)
    //     .set({ refresh_token: refToken })
    //     .where("user.id = :id", { id })
    // }

    removeRefToken(id: string) {
        return this.createQueryBuilder("user")
        .update(User)
        .set({ refresh_token: null! })
        .where("user.id = :id", { id })
        .execute();
    }

}