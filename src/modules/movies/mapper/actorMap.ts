import { UniqueID } from '../../../core/domain/UniqueID';
import { Mapper } from '../../../core/infrastructure/Mapper';

import { Actor } from '../domain/actor';

export class ActorMap extends Mapper<Actor> {
  private static toProps(actor: Actor) {
    const props = {
      fullName: actor.fullName.trim()
    };

    return props;
  }

  public static toPersistence(actor: Actor): any {
    const id = actor.id.toString();
    const props = this.toProps(actor);

    return { id, ...props };
  }

  public static toDomain(raw: any): Actor {
    const actorOrError = Actor.create(
      {
        fullName: raw.fullName,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueID(raw.id)
    );
    if (actorOrError.isFailure) console.log(actorOrError.error);

    return actorOrError.getValue() || null;
  }
}
