import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { findAuthorByIdResolver } from '../../../useCases/findAuthorById';
import { findAuthorsResolver } from '../../../useCases/findAuthors';

import { author } from './types';

export const findAuthorById = {
  type: author,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: findAuthorByIdResolver.resolve
};

export const findAuthors = {
  type: new GraphQLList(author),
  args: {
    fullName: {
      type: GraphQLString
    }
  },
  resolve: findAuthorsResolver.resolve
};
