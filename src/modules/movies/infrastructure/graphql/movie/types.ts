import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { uniqueID } from '../../../../../infrastructure/graphql/types';
import { actor } from '../actor/types';
import { author } from '../author/types';

export const movie = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: uniqueID },
    name: { type: GraphQLString },
    year: { type: GraphQLInt },
    actors: { type: new GraphQLList(actor) },
    authors: { type: new GraphQLList(author) },
    createdAt: { type: GraphQLFloat },
    updatedAt: { type: GraphQLFloat }
  })
});

export const createMovieInput = new GraphQLInputObjectType({
  name: 'CreateMovieInput',
  fields: () => ({
    name: { type: GraphQLString },
    year: { type: GraphQLInt },
    actors: { type: new GraphQLList(GraphQLString) },
    authors: { type: new GraphQLList(GraphQLString) }
  })
});

export const updateMovieDetailListInput = new GraphQLInputObjectType({
  name: 'UpdateMovieDetailListInput',
  fields: () => ({
    new: { type: new GraphQLList(GraphQLString) },
    removes: { type: new GraphQLList(GraphQLString) }
  })
});

export const updateMovieInput = new GraphQLInputObjectType({
  name: 'UpdateMovieInput',
  fields: () => ({
    name: { type: GraphQLString },
    year: { type: GraphQLInt },
    actors: { type: updateMovieDetailListInput },
    authors: { type: updateMovieDetailListInput }
  })
});
