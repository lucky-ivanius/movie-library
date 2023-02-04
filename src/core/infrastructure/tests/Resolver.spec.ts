import { GraphQLError, GraphQLFieldResolver } from 'graphql';

import { Resolver } from '../Resolver';

class TestResolver extends Resolver {
  public resolve: GraphQLFieldResolver<any, any, any> = async (
    _source,
    _args,
    _context
  ) => {
    return null;
  };
}

describe('Resolver', () => {
  it('ok', () => {
    const resolver = new TestResolver();
    const result = resolver.ok('success');
    expect(result).toEqual('success');
  });

  it('ok without dto', () => {
    const resolver = new TestResolver();
    const result = resolver.ok();
    expect(result).toBeUndefined();
  });

  it('badRequest', () => {
    const resolver = new TestResolver();
    expect(() => {
      resolver.badRequest('bad request message');
    }).toThrowError(GraphQLError);
  });

  it('notFound', () => {
    const resolver = new TestResolver();
    expect(() => {
      resolver.notFound('not found message');
    }).toThrowError(GraphQLError);
  });

  it('unexpected', () => {
    const resolver = new TestResolver();
    expect(() => {
      resolver.unexpected('unexpected message');
    }).toThrowError(GraphQLError);
  });
});
