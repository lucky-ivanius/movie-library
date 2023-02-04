import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { BadRequest } from '../../../../core/logic/Errors';

import { CreateAuthorUseCase } from './createAuthorUseCase';
import { CreateAuthorDTO } from './createAuthorDTO';

export class CreateAuthorResolver extends Resolver {
  private useCase: CreateAuthorUseCase;

  constructor(useCase: CreateAuthorUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, CreateAuthorDTO> = async (
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
