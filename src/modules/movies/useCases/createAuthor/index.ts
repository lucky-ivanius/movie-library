import { CreateAuthorResolver } from './createAuthorResolver';
import { CreateAuthorUseCase } from './createAuthorUseCase';
import { authorRepo } from '../../repos';

const createAuthorUseCase = new CreateAuthorUseCase(authorRepo);
const createAuthorResolver = new CreateAuthorResolver(createAuthorUseCase);

export { createAuthorUseCase, createAuthorResolver };
