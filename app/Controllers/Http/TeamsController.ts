import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionHandler from 'App/Exceptions/Handler';
import Team from 'App/Models/Team'
import CreateTeamValidator from 'App/Validators/CreateTeamValidator'

export default class TeamsController {
  public async index() {
    return await Team.all();
  }
  
  public async show(ctx: HttpContextContract) {
    const { params } = ctx
    const { id } = params
    const team = await Team.find(+id)
    if (!team) {
      return new ExceptionHandler().handle({ status: 406, message: 'register not found' }, ctx)
    }
    return team
  }
  
  public async update(ctx: HttpContextContract) {
    const { params, request } = ctx
    const { id } = params
    const body = request.body()
    const team = await Team.findOrFail(+id)
    
    team.name = body.name

    return await team.save()
  }
  
  public async destroy(ctx: HttpContextContract) {
    const { params } = ctx
    const { id } = params
    
    const team = await Team.findOrFail(+id)
    await team.delete()
    
    if(team.$isDeleted){
      return;
    }else{
      return new ExceptionHandler().handle({ status: 400, message: "Não foi possível deletar o registro" }, ctx)
    }
  }
  
  public async store(ctx: HttpContextContract) {
    const { request } = ctx
    await request.validate(CreateTeamValidator)
    const body = request.body()
    try{
      return await Team.create({
        name: body.name
      })
    }catch(error){
      return new ExceptionHandler().handle({ status: 400, message: error.message }, ctx)
    }
  }
}
