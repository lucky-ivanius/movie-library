import { GraphQLError, GraphQLFieldResolver } from 'graphql';

interface OptionsType {
  code: number;
  type: string;
}

export abstract class Resolver {
  public abstract resolve: GraphQLFieldResolver<any, any, any>;

  public ok<T>(dto?: T) {
    return dto;
  }

  public badRequest(message: string) {
    throw this.fail(message, {
      code: 400,
      type: 'BAD_REQUEST'
    });
  }

  public notFound(message: string) {
    throw this.fail(message, {
      code: 404,
      type: 'NOT_FOUND'
    });
  }

  public unexpected(message: string) {
    throw this.fail(message, {
      code: 500,
      type: 'UNEXPECTED'
    });
  }

  private fail(error: Error | string, options?: OptionsType) {
    throw new GraphQLError(error.toString(), {
      extensions: {
        ...options
      }
    });
  }
}
