import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';

import { FindMovieByIdUseCase } from './findMovieByIdUseCase';
import { FindMovieByIdDTO } from './findMovieByIdDTO';

export class FindMovieByIdResolver extends Resolver {
  private useCase: FindMovieByIdUseCase;

  constructor(useCase: FindMovieByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, FindMovieByIdDTO> = async (
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
