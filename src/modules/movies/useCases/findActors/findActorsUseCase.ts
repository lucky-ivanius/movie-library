import { Either, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { ActorCollection } from '../../domain/actor';
import { IActorRepo } from '../../repos/actorRepo';
import { FindActorsDTO } from './findActorsDTO';

type Errors = null;

type ActorResult = Either<Errors, Result<ActorCollection>>;

export class FindActorsUseCase implements UseCase<FindActorsDTO, ActorResult> {
  private actorRepo: IActorRepo;

  constructor(actorRepo: IActorRepo) {
    this.actorRepo = actorRepo;
  }

  async execute(input: FindActorsDTO) {
    const actors = await this.actorRepo.findActors(input);

    return right(Result.ok<ActorCollection>(actors)) as ActorResult;
  }
}
