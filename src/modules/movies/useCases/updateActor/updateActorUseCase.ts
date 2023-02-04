import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Actor } from '../../domain/actor';
import { IActorRepo } from '../../repos/actorRepo';
import { UpdateActorDTO } from './updateActorDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | BadRequest | NotFound;

type ActorResult = Either<Errors, Result<Actor>>;

export class UpdateActorUseCase
  implements UseCase<UpdateActorDTO, ActorResult>
{
  private actorRepo: IActorRepo;

  constructor(actorRepo: IActorRepo) {
    this.actorRepo = actorRepo;
  }

  async execute(input: UpdateActorDTO) {
    const { id, data } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Actor ID: ${id}`)) as ActorResult;

    const actor = await this.actorRepo.findActorById(id);
    if (!actor) return left(new NotFound(id, 'Actor')) as ActorResult;

    const actorOrError = Actor.create(
      {
        fullName: data.fullName ?? actor.fullName
      },
      actor.id
    );

    if (actorOrError.isFailure)
      return left(new BadRequest(actorOrError.error as string)) as ActorResult;

    const updatedActor = await this.actorRepo.save(actorOrError.getValue());

    return right(Result.ok<Actor>(updatedActor)) as ActorResult;
  }
}
