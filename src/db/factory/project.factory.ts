import Faker from "faker";
import { define } from "typeorm-seeding";
import { User } from "../entity/User";
import { Follow } from "../entity/Follow";
import { Project } from "../entity/Project";


// define(User, (faker: typeof Faker) => {
//     let passNum = -1;
//     passNum = passNum + 1;
    
//     const user = new User();
//     user.email = faker.internet.email();
//     user.nickname = faker.name.findName();
//     user.role = 'NORMAL';
//     user.password = passNum.toString();
//     user.hashPass();
//     return user;
// });

// define(Follow, (faker: typeof Faker) => {

// })

// define(User, (faker: typeof Faker) => {  
//     const user = new User();
//     user.email = faker.internet.email();
//     user.nickname = faker.name.findName();
//     user.
//     return project;
// })