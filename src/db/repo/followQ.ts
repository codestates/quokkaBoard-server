import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Follow } from '../entity/Follow';


@EntityRepository(Follow)
export class FollowRepo extends Repository <Follow> {
    checkFollow(data: User) {
        return this
        .createQueryBuilder("follow")
        .leftJoin("follow.follower", "follower")
        .leftJoin("follow.following", "following")
        .select([
            "registed",
            "follower.id AS userId",
            "follower.nickname AS nickname",
            "follower.email AS email",
            "follower.image AS image"
        ])
        .where("follow.following = :following", {following: data.id})
        .orWhere("follow.follower = :follower", {follower: data.id})
        .getRawMany()
    }
    // async checkFollow(data: User) {
    //     const followers = await this.find({
    //         select: ['follower', 'registed'],
    //         where: {following: data.id},
    //         relations: ['follower']
    //     });
        
    //     const result1 = followers.map(el => {
    //         return {
    //             id: el.id,
    //             registed: el.registed,
    //             userId: el.follower.id,
    //             nickname: el.follower.nickname,
    //             email: el.follower.email,
    //             image: el.follower.image
    //         }
    //     });
    //     const followings = await this.find({
    //         select: ['following', 'registed'],
    //         where: {follower: data.id},
    //         relations: ['following'],
    //     });
    //     const result2 = followings.map(el => {
    //         return {
    //             id: el.id,
    //             registed: el.registed,
    //             userId: el.following.id,
    //             nickname: el.following.nickname,
    //             email: el.following.email,
    //             image: el.following.image
    //         }
    //     });
    //     return [...result1, ...result2];
    // }
}