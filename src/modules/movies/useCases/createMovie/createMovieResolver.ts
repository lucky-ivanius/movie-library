import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { BadRequest, InvalidId } from '../../../../core/logic/Errors';

import { CreateMovieUseCase } from './createMovieUseCase';
import { CreateMovieDTO } from './createMovieDTO';

export class CreateMovieResolver extends Resolver {
  private useCase: CreateMovieUseCase;

  constructor(useCase: CreateMovieUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, CreateMovieDTO> = async (
    _source,
    args
  ) => {
    try {
      const result = await this.useCase.execute(args);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
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
