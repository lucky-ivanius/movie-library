import '../infrastructure/sequelize';

import { ActorRepo } from './actorRepo';
import { AuthorRepo } from './authorRepo';
import { MovieRepo } from './movieRepo';

import { sequelize } from '../../../infrastructure/sequelize';

const { models } = sequelize;

const actorRepo = new ActorRepo(models);
const authorRepo = new AuthorRepo(models);
const movieRepo = new MovieRepo(models);

export { actorRepo, authorRepo, movieRepo };
