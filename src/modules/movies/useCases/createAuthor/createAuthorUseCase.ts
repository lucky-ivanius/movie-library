import { BadRequest } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Author } from '../../domain/author';
import { IAuthorRepo } from '../../repos/authorRepo';
import { CreateAuthorDTO } from './createAuthorDTO';

type Errors = BadRequest;

type AuthorResult = Either<Errors, Result<Author>>;

export class CreateAuthorUseCase
  implements UseCase<CreateAuthorDTO, AuthorResult>
{
  private authorRepo: IAuthorRepo;

  constructor(authorRepo: IAuthorRepo) {
    this.authorRepo = authorRepo;
  }

  async execute(input: CreateAuthorDTO) {
    const { fullName } = input.data ?? {};

    const authorOrError = Author.create({
      fullName
    });

    if (authorOrError.isFailure)
      return left(
        new BadRequest(authorOrError.error as string)
      ) as AuthorResult;

    const createdAuthor = await this.authorRepo.save(authorOrError.getValue());

    return right(Result.ok<Author>(createdAuthor)) as AuthorResult;
  }
}
