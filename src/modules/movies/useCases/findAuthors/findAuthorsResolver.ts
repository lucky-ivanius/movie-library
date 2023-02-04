import { Resolver } from '../../../../core/infrastructure/Resolver';
import { FindAuthorsUseCase } from './findAuthorsUseCase';
import { FindAuthorsDTO } from './findAuthorsDTO';
import { GraphQLFieldResolver } from 'graphql';

export class FindAuthorsResolver extends Resolver {
  private useCase: FindAuthorsUseCase;

  constructor(useCase: FindAuthorsUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, FindAuthorsDTO> = async (
    _source,
    args
  ) => {
    try {
      const result = await this.useCase.execute(args);

      if (result.isLeft()) return [];

      return this.ok(result.value.getValue());
    } catch (err) {
      return err;
    }
  };
}
