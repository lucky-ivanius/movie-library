import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import {
  actorMutations,
  actorQueries,
  authorMutations,
  authorQueries,
  movieMutations,
  movieQueries
} from '../../modules/movies/infrastructure/graphql';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...actorQueries,
    ...authorQueries,
    ...movieQueries
  })
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...actorMutations,
    ...authorMutations,
    ...movieMutations
  })
});

export const schema = new GraphQLSchema({
  query,
  mutation
});
