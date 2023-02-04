import { GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../../../../core/infrastructure/Resolver';
import {
  UnsuccessfulOperation,
  InvalidId,
  NotFound
} from '../../../../core/logic/Errors';

import { DeleteAuthorUseCase } from './deleteAuthorUseCase';
import { DeleteAuthorDTO } from './deleteAuthorDTO';

export class DeleteAuthorResolver extends Resolver {
  private useCase: DeleteAuthorUseCase;

  constructor(useCase: DeleteAuthorUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, DeleteAuthorDTO> = async (
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
          case UnsuccessfulOperation:
            return this.unexpected(error.errorValue().message);
        }

        return null;
      }

      return this.ok(
        `Author with id ${result.value.getValue()} has been successfully removed from the database.`
      );
    } catch (err) {
      return err;
    }
  };
}
