import { FindActorsResolver } from './findActorsResolver';
import { FindActorsUseCase } from './findActorsUseCase';
import { actorRepo } from '../../repos';

const findActorsUseCase = new FindActorsUseCase(actorRepo);
const findActorsResolver = new FindActorsResolver(findActorsUseCase);

export { findActorsUseCase, findActorsResolver };
