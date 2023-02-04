import { Resolver } from '../../../../core/infrastructure/Resolver';
import { FindMoviesUseCase } from './findMoviesUseCase';
import { FindMoviesDTO } from './findMoviesDTO';
import { GraphQLFieldResolver } from 'graphql';

export class FindMoviesResolver extends Resolver {
  private useCase: FindMoviesUseCase;

  constructor(useCase: FindMoviesUseCase) {
    super();
    this.useCase = useCase;
  }

  public resolve: GraphQLFieldResolver<any, any, FindMoviesDTO> = async (
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
