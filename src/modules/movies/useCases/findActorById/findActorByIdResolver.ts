import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';

import { FindActorByIdUseCase } from './findActorByIdUseCase';
import { FindActorByIdDTO } from './findActorByIdDTO';

export class FindActorByIdResolver extends Resolver {
  private useCase: FindActorByIdUseCase;

  constructor(useCase: FindActorByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, FindActorByIdDTO> = async (
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
        }

        return null;
      }

      return this.ok(result.value.getValue());
    } catch (err) {
      return err;
    }
  };
}
