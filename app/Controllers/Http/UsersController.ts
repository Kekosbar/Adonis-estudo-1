import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'interfaces/User'
import CreateUser from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async index() {
    return await Database
              .query()
              .from('users')
              .select('*')
  }

  public async show(ctx: HttpContextContract) {
    const { params } = ctx
    const id = +params.id
    const [user] = await Database
                      .query()
                      .from('users')
                      .where('id', id)
                      .select('*')
    if (!user) {
      return new ExceptionHandler().handle({ status: 406, message: 'user not found' }, ctx)
    }
    return user
  }

  public async update(ctx: HttpContextContract) {
    const { params, request, response } = ctx;
    // await request.validate(CreateUser)
    const id = +params.id
    const body = request.body()
    
    const [user] = await Database
                      .query()
                      .from('users')
                      .where('id', id)
                      .select('*')
    if (!user) {
      return new ExceptionHandler().handle({ status: 406, message: 'user not found' }, ctx)
    }

    const editUser: User = {
      name: body.name ? body.name : user.name,
      age: body.age ? body.age : user.age,
      email: body.email ? body.email : user.email,
      team_id: body.team_id ? body.team_id : user.team_id,
      updated_at: new Date()
    }
    await Database
      .query()
      .from('users')
      .where('id', id)
      .update(editUser)
      .then(() => response.send({ msm: 'Registro editado com sucesso' }))
      .catch(error => new ExceptionHandler().handle({ status: 400, message: error.message }, ctx))
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, response } = ctx;
    const id = +params.id
    return await Database
                .query()
                .from('users')
                .where('id', id)
                .delete()
                .then(() => response.send({ msm: 'Registro deletado com sucesso' }))
                .catch(error => new ExceptionHandler().handle({ status: 400, message: error.message }, ctx))
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx;
    await request.validate(CreateUser)
    const body = request.body()
    const newUser: User = {
      name: body.name,
      age: body.age,
      email: body.email,
      team_id: body.team_id,
      created_at: new Date(),
      updated_at: new Date()
    }
    await Database
      .insertQuery()
      .table('users')
      .insert(newUser)
      .then(() => response.send({ msm: 'Registro salvo com sucesso' }))
      .catch(error => new ExceptionHandler().handle({ status: 400, message: error.message }, ctx))
  }
}
