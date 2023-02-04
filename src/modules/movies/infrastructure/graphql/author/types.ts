import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { uniqueID } from '../../../../../infrastructure/graphql/types';

export const author = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: uniqueID },
    fullName: { type: GraphQLString },
    createdAt: { type: GraphQLFloat },
    updatedAt: { type: GraphQLFloat }
  })
});

export const createAuthorInput = new GraphQLInputObjectType({
  name: 'CreateAuthorInput',
  fields: () => ({
    fullName: { type: GraphQLString }
  })
});

export const updateAuthorInput = new GraphQLInputObjectType({
  name: 'UpdateAuthorInput',
  fields: () => ({
    fullName: { type: GraphQLString }
  })
});
