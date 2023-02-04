import {
  InvalidId,
  NotFound,
  UnsuccessfulOperation
} from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { IActorRepo } from '../../repos/actorRepo';
import { DeleteActorDTO } from './deleteActorDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | NotFound | UnsuccessfulOperation;

type ActorResult = Either<Errors, Result<string>>;

export class DeleteActorUseCase
  implements UseCase<DeleteActorDTO, ActorResult>
{
  private actorRepo: IActorRepo;

  constructor(actorRepo: IActorRepo) {
    this.actorRepo = actorRepo;
  }

  async execute(input: DeleteActorDTO) {
    const { id } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Actor ID: ${id}`)) as ActorResult;

    const actor = await this.actorRepo.findActorById(id);
    if (!actor) return left(new NotFound(id, 'Actor')) as ActorResult;

    const deletedActor = await this.actorRepo.remove(id);
    if (!deletedActor)
      return left(
        new UnsuccessfulOperation('Unsuccesful operation')
      ) as ActorResult;

    return right(Result.ok<string>(id)) as ActorResult;
  }
}
