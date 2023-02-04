import { FindAuthorByIdResolver } from './findAuthorByIdResolver';
import { FindAuthorByIdUseCase } from './findAuthorByIdUseCase';
import { authorRepo } from '../../repos';

const findAuthorByIdUseCase = new FindAuthorByIdUseCase(authorRepo);
const findAuthorByIdResolver = new FindAuthorByIdResolver(
  findAuthorByIdUseCase
);

export { findAuthorByIdUseCase, findAuthorByIdResolver };
