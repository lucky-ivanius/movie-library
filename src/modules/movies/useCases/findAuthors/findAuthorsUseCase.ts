import { Either, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { AuthorCollection } from '../../domain/author';
import { IAuthorRepo } from '../../repos/authorRepo';
import { FindAuthorsDTO } from './findAuthorsDTO';

type Errors = null;

type AuthorResult = Either<Errors, Result<AuthorCollection>>;

export class FindAuthorsUseCase
  implements UseCase<FindAuthorsDTO, AuthorResult>
{
  private authorRepo: IAuthorRepo;

  constructor(authorRepo: IAuthorRepo) {
    this.authorRepo = authorRepo;
  }

  async execute(input: FindAuthorsDTO) {
    const authors = await this.authorRepo.findAuthors(input);

    return right(Result.ok<AuthorCollection>(authors)) as AuthorResult;
  }
}
