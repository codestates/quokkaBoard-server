import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entity/User'
import { Follow } from '../entity/Follow'


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
}