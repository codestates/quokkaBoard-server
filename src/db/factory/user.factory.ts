import { factory, define } from "typeorm-seeding"
import { User } from "../entity/User"
import Faker from "faker"

define(User, (faker: typeof Faker) => {
    const user = new User()
    user.email = faker.internet.email()
    user.nickname = faker.random.word()
    user.password = "password"
    user.created_at = faker.date.past()
    user.updated_at = faker.date.recent()
    
    return user;
})