import { Request, Response } from 'express';
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult
} from 'graphql-helix';

import { schema } from './schema';

const graphqlController = async (req: Request, res: Response) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query
  };

  const { operationName, query, variables } = getGraphQLParameters(request);

  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema
  });

  sendResult(result, res);
};

const graphiqlController = (_req: Request, res: Response) => {
  return res.send(renderGraphiQL());
};

export { graphqlController, graphiqlController };
