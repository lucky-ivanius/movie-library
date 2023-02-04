import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';

import { UpdateAuthorUseCase } from './updateAuthorUseCase';
import { UpdateAuthorDTO } from './updateAuthorDTO';

export class UpdateAuthorResolver extends Resolver {
  private useCase: UpdateAuthorUseCase;

  constructor(useCase: UpdateAuthorUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, UpdateAuthorDTO> = async (
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
