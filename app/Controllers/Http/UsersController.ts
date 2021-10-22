import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import User from 'interfaces/User'
import UserSchema from '../../../schemas/user'

const users: User[] = []

export default class UsersController {
  public async index() {
    return users
  }

  public async show({ params, response }: HttpContextContract) {
    const id = +params.id
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return response.status(400).send('User not found')
    }
    return response.send(users[userIndex])
  }

  public async update({ params, response, request }: HttpContextContract) {
    const id = +params.id
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return response.status(400).send('User not found')
    }
    const user = users[userIndex]
    const body = request.body()
    users[userIndex] = {
      ...user,
      ...body,
      id: user.id,
    }
    return response.send(users[userIndex])
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, response } = ctx;
    const id = +params.id
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      return new ExceptionHandler().handle({ status: 406, message: 'user not found' }, ctx)
    }
    delete users[userIndex]
    return response.send({ msm: 'Registro deletado' })
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: UserSchema
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }
    const body: any = request.body()
    const newUser: User = {
      id: users.length,
      name: body.name,
      age: body.age,
      email: body.email,
    }
    users.push(newUser)
    return newUser
  }
}
