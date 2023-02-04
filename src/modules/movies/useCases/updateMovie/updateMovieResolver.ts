import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';

import { UpdateMovieUseCase } from './updateMovieUseCase';
import { UpdateMovieDTO } from './updateMovieDTO';

export class UpdateMovieResolver extends Resolver {
  private useCase: UpdateMovieUseCase;

  constructor(useCase: UpdateMovieUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, UpdateMovieDTO> = async (
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
