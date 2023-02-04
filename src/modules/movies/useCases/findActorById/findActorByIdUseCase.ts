import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Actor } from '../../domain/actor';
import { IActorRepo } from '../../repos/actorRepo';
import { FindActorByIdDTO } from './findActorByIdDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | NotFound;

type ActorResult = Either<Errors, Result<Actor>>;

export class FindActorByIdUseCase
  implements UseCase<FindActorByIdDTO, ActorResult>
{
  private actorRepo: IActorRepo;

  constructor(actorRepo: IActorRepo) {
    this.actorRepo = actorRepo;
  }

  async execute(input: FindActorByIdDTO) {
    const { id } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Actor ID: ${id}`)) as ActorResult;

    const actor = await this.actorRepo.findActorById(id);

    if (actor) return right(Result.ok<Actor>(actor)) as ActorResult;

    return left(new NotFound(id, 'Actor')) as ActorResult;
  }
}
