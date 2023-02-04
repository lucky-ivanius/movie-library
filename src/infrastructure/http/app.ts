import express, { Express, Request, Response } from 'express';

import { connectDb } from '../sequelize';
import { graphiqlController, graphqlController } from '../graphql';

connectDb();

const app: Express = express();

app.use(express.json());
app.use('/graphql', graphqlController);
app.use('/graphiql', graphiqlController);

app.use((_req: Request, res: Response) => {
  res.status(404).json({});
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`[App]: Server listening on 4000`);
});
