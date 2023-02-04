import { BadRequest } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Actor } from '../../domain/actor';
import { IActorRepo } from '../../repos/actorRepo';
import { CreateActorDTO } from './createActorDTO';

type Errors = BadRequest;

export type ActorResult = Either<Errors, Result<Actor>>;

export class CreateActorUseCase
  implements UseCase<CreateActorDTO, ActorResult>
{
  private actorRepo: IActorRepo;

  constructor(actorRepo: IActorRepo) {
    this.actorRepo = actorRepo;
  }

  async execute(input: CreateActorDTO) {
    const { fullName } = input.data ?? {};

    const actorOrError = Actor.create({
      fullName
    });

    if (actorOrError.isFailure)
      return left(new BadRequest(actorOrError.error as string)) as ActorResult;

    const createdActor = await this.actorRepo.save(actorOrError.getValue());

    return right(Result.ok<Actor>(createdActor)) as ActorResult;
  }
}
