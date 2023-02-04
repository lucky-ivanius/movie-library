import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';

import { UpdateActorUseCase } from './updateActorUseCase';
import { UpdateActorDTO } from './updateActorDTO';

export class UpdateActorResolver extends Resolver {
  private useCase: UpdateActorUseCase;

  constructor(useCase: UpdateActorUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, UpdateActorDTO> = async (
    _source,
    args
  ) => {
    try {
      const result = await this.useCase.execute(args);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case NotFound:
            return this.notFound(error.errorValue().message);
          case InvalidId:
            return this.badRequest(error.errorValue().message);
          case BadRequest:
            return this.badRequest(error.errorValue().message);
        }

        return null;
      }

      return this.ok(result.value.getValue());
    } catch (err) {
      return err;
    }
  };
}
