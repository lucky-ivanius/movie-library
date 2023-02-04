import { FindAuthorsResolver } from './findAuthorsResolver';
import { FindAuthorsUseCase } from './findAuthorsUseCase';
import { authorRepo } from '../../repos';

const findAuthorsUseCase = new FindAuthorsUseCase(authorRepo);
const findAuthorsResolver = new FindAuthorsResolver(findAuthorsUseCase);

export { findAuthorsUseCase, findAuthorsResolver };
