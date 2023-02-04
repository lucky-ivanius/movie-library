import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { uniqueID } from '../../../../../infrastructure/graphql/types';

export const actor = new GraphQLObjectType({
  name: 'Actor',
  fields: () => ({
    id: { type: uniqueID },
    fullName: { type: GraphQLString },
    createdAt: { type: GraphQLFloat },
    updatedAt: { type: GraphQLFloat }
  })
});

export const createActorInput = new GraphQLInputObjectType({
  name: 'CreateActorInput',
  fields: () => ({
    fullName: { type: GraphQLString }
  })
});

export const updateActorInput = new GraphQLInputObjectType({
  name: 'UpdateActorInput',
  fields: () => ({
    fullName: { type: GraphQLString }
  })
});
