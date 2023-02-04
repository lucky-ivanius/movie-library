import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { BadRequest } from '../../../../core/logic/Errors';

import { CreateActorUseCase } from './createActorUseCase';
import { CreateActorDTO } from './createActorDTO';

export class CreateActorResolver extends Resolver {
  private useCase: CreateActorUseCase;

  constructor(useCase: CreateActorUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, CreateActorDTO> = async (
    _source,
    args
  ) => {
    try {
      const result = await this.useCase.execute(args);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
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
