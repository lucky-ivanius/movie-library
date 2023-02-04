import { Resolver } from '../../../../core/infrastructure/Resolver';
import { FindActorsUseCase } from './findActorsUseCase';
import { FindActorsDTO } from './findActorsDTO';
import { GraphQLFieldResolver } from 'graphql';

export class FindActorsResolver extends Resolver {
  private useCase: FindActorsUseCase;

  constructor(useCase: FindActorsUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, FindActorsDTO> = async (
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
