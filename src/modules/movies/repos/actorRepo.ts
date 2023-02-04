import { Op } from 'sequelize';

import { Actor, ActorCollection } from '../domain/actor';
import { ActorId } from '../domain/actorId';
import { ActorMap } from '../mapper/actorMap';

export interface IActorRepo {
  findActorById(actorId: ActorId | string): Promise<Actor | null>;
  findActorByIds(actorIds: Array<ActorId | string>): Promise<ActorCollection>;
  findActors(query?: any): Promise<ActorCollection>;
  exists(actorId: ActorId | string): Promise<boolean>;
  save(actor: Actor): Promise<Actor>;
  remove(actorId: ActorId | string): Promise<boolean>;
}

export class ActorRepo implements IActorRepo {
  protected actorModel: any;

  constructor(private models: any) {
    this.actorModel = this.models.Actor;
  }

  public async findActorById(actorId: ActorId | string): Promise<Actor | null> {
    const actor = await this.actorModel.findByPk(
      actorId instanceof ActorId ? (<ActorId>actorId).id.toValue() : actorId
    );
    if (!!actor) return ActorMap.toDomain(actor);
    return null;
  }

  public async findActorByIds(
    actorIds: Array<ActorId | string>
  ): Promise<ActorCollection> {
    const actors = await this.actorModel.findAll({
      where: {
        id: actorIds.map((actorId) =>
          actorId instanceof ActorId ? (<ActorId>actorId).id.toValue() : actorId
        )
      }
    });

    return actors.map((actor: any) => ActorMap.toDomain(actor));
  }

  public async findActors(query?: any): Promise<ActorCollection> {
    const where = {
      fullName: { [Op.iLike]: `%${query.fullName || ''}%` }
    };

    const actors = await this.actorModel.findAll({
      where
    });
    return actors.map((actor: any) => ActorMap.toDomain(actor));
  }

  public async exists(actorId: ActorId | string): Promise<boolean> {
    const actor = await this.actorModel.findByPk(
      actorId instanceof ActorId ? (<ActorId>actorId).id.toValue() : actorId
    );
    return !!actor;
  }

  public async save(actor: Actor): Promise<Actor> {
    const existingActor = await this.actorModel.findByPk(actor.id.toValue());
    const rawActor = ActorMap.toPersistence(actor);

    if (!!existingActor) {
      await existingActor.update(rawActor);
    } else {
      await this.actorModel.create(rawActor);
    }

    const savedActor = await this.actorModel.findByPk(actor.id.toValue());
    return ActorMap.toDomain(savedActor);
  }

  public async remove(actorId: ActorId | string): Promise<boolean> {
    const existingActor = await this.actorModel.findByPk(
      actorId instanceof ActorId ? (<ActorId>actorId).id.toValue() : actorId
    );

    if (!!existingActor) {
      await existingActor.destroy();
      return true;
    }

    return false;
  }
}
