import { Response } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from '../db/repo/userQ';
import { TypeReq, StrProps } from '../types';
import { User } from '../db/entity/User';
import { FollowRepo } from '../db/repo/followQ';


const member = {

    searchFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { email, nickname } = req.body;
            if(!email) delete req.body.email;
            if(!nickname) delete req.body.nickname;
            
            const userRepo = getCustomRepository(UserRepo);
            const findUser = await userRepo.searchUser(req.body);
            if(findUser.length === 0) throw Error;
            
            res.status(200).send({
                success: true,
                data: findUser
            });
        } catch (e) {
            res.status(202).send({
                success: false,
                message: '존재하지 않는 사용자입니다'
            })
        }
    },

    addFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { userId, followerId } = req.body
            const userRepo = getRepository(User);
            const followRepo = getCustomRepository(FollowRepo);
            
            const followingUser = await userRepo.findOne({
                select: ['id', 'nickname', 'email', 'image'],
                where: {id: userId}
            })
            const followerUser = await userRepo.findOne({
                select: ['id', 'nickname', 'email', 'image'],
                where: {id: followerId}
            })
            if(!followingUser || !followerUser) throw new Error('user');
            
            const follow = await followRepo.checkFollow(followingUser);         
            const check = follow.filter(el => el.userId === followerId)
            if(check.length !== 0) throw new Error('user');
            
            const newFollowRepo = followRepo.create({
                following: followingUser, 
                follower: followerUser
            });
            followRepo.save(newFollowRepo);
            
            res.status(200).send({
                success: true,
                data: newFollowRepo
            });
        } catch (e) {
            e.message === 'user'
            ? res.status(202).send({
                success: false,
                message: "잘못된 요청입니다"
            })
            : res.status(202).send('server error');
        }
    },

    deleteFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const { userId, followerId } = req.body
            const userRepo = getRepository(User);
            const followRepo = getCustomRepository(FollowRepo);
            
            const followingUser = await userRepo.findOne({where: {id: userId}});
            const followerUser = await userRepo.findOne({where: {id: followerId}});
            if(!followingUser || !followerUser) throw new Error('user');
            
            const follow = await followRepo.checkFollow(followingUser);         
            const check = follow.filter(el => el.userId === followerId)
            if(!check) throw new Error('user');
            followRepo.delete({id: check[0].id})
            
            res.status(200).send({
                success: true,
                data: check
            });
        } catch (e) {
            e.message === 'user'
            ? res.status(202).send({
                success: false,
                message: "잘못된 요청입니다"
            })
            : res.status(202).send('server error');
        }
    },

    getFollower: async (req: TypeReq<StrProps>, res: Response) => {
        try {
            const userRepo = getRepository(User);
            const followRepo = getCustomRepository(FollowRepo);
            const followingUser = await userRepo.findOne({
                where: {id: req.body.userId}
            });

            if(!followingUser) throw new Error('user');
            const follow = await followRepo.checkFollow(followingUser);
            
            res.status(200).send({
                success: true,
                data: follow
            });
        } catch (e) {
            e.message === 'user'
            ? res.status(202).send({
                success: false,
                message: "잘못된 요청입니다"
            })
            : res.status(202).send('server error')
        }
    }
}

export default member;