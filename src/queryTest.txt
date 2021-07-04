import { getCustomRepository, getRepository } from 'typeorm';
import { UserRepo } from './db/repo/userDm';
import { User } from './db/entity/User';
import { createConnection } from 'net';
import { UserInfo, UserReq } from './types';


const queryTest = {

    findByName: async (name: string) =>  {

        const userRepo = getRepository(User) // user table을 소환
        const customUserRepo = getCustomRepository(UserRepo) // custom repo를 소환

        const findName= await customUserRepo.findName(name)
        if(!findName) console.log("Not found")
        console.log("name: ", findName)
    }
}

createConnection() 
    .then(() => {
        console.log('ORM success DB connect!');    
    })
    .catch(err => console.log(err));


queryTest.findByName("Estella Kutch")