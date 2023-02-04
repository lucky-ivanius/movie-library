import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

const uniqueID = new GraphQLObjectType({
  name: 'UniqueID',
  fields: () => ({
    value: { type: GraphQLString }
  })
});

const pagination = new GraphQLObjectType({
  name: 'Pagination',
  fields: () => ({
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    total: { type: GraphQLInt }
  })
});

export { uniqueID, pagination };
