import { schema } from '@ioc:Adonis/Core/Validator'

const UserSchema = schema.create({
  name: schema.string(),
  age: schema.number(),
  email: schema.string.optional()
}) 

export default UserSchema;