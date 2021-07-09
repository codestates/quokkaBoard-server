import { factory, define } from "typeorm-seeding"
import { User } from "../entity/User"
import Faker from "faker"

define(User, (faker: typeof Faker) => {
  
    const gender = faker.random.number(1)
    const firstName = faker.name.firstName(gender)
    const lastName = faker.name.lastName(gender)
  
    const user = new User()
    user.nickname = `${firstName} ${lastName}`
    user.email = faker.internet.email()
    user.role = faker.company.bsNoun()
    user.nickname = faker.random.word()
    user.password = "password"
    user.image = faker.image.imageUrl()
    user.refresh_token = faker.random.word()
    user.created_at = faker.date.past()
    user.updated_at = faker.date.recent()
    
    return user;
  })