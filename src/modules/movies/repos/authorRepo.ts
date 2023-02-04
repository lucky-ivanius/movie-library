import { Op } from 'sequelize';

import { Author, AuthorCollection } from '../domain/author';
import { AuthorId } from '../domain/authorId';
import { AuthorMap } from '../mapper/authorMap';

export interface IAuthorRepo {
  findAuthorById(authorId: AuthorId | string): Promise<Author | null>;
  findAuthors(query?: any): Promise<AuthorCollection>;
  findAuthorByIds(
    authorIds: Array<AuthorId | string>
  ): Promise<AuthorCollection>;
  exists(authorId: AuthorId | string): Promise<boolean>;
  save(author: Author): Promise<Author>;
  remove(authorId: AuthorId | string): Promise<boolean>;
}

export class AuthorRepo implements IAuthorRepo {
  protected authorModel: any;

  constructor(private models: any) {
    this.authorModel = this.models.Author;
  }

  public async findAuthorById(
    authorId: AuthorId | string
  ): Promise<Author | null> {
    const user = await this.authorModel.findByPk(
      authorId instanceof AuthorId
        ? (<AuthorId>authorId).id.toValue()
        : authorId
    );
    if (!!user) return AuthorMap.toDomain(user);
    return null;
  }

  public async findAuthorByIds(
    authorIds: Array<AuthorId | string>
  ): Promise<AuthorCollection> {
    const authors = await this.authorModel.findAll({
      where: {
        id: authorIds.map((authorId) =>
          authorId instanceof AuthorId
            ? (<AuthorId>authorId).id.toValue()
            : authorId
        )
      }
    });

    return authors.map((author: any) => AuthorMap.toDomain(author));
  }

  public async findAuthors(query?: any): Promise<AuthorCollection> {
    const where = {
      fullName: { [Op.iLike]: `%${query.fullName || ''}%` }
    };

    const authors = await this.authorModel.findAll({
      where
    });
    return authors.map((author: any) => AuthorMap.toDomain(author));
  }

  public async exists(authorId: AuthorId | string): Promise<boolean> {
    const author = await this.authorModel.findByPk(
      authorId instanceof AuthorId
        ? (<AuthorId>authorId).id.toValue()
        : authorId
    );
    return !!author;
  }

  public async save(author: Author): Promise<Author> {
    const existingAuthor = await this.authorModel.findByPk(author.id.toValue());
    const rawAuthor = AuthorMap.toPersistence(author);

    if (!!existingAuthor) {
      await existingAuthor.update(rawAuthor);
    } else {
      await this.authorModel.create(rawAuthor);
    }

    const savedAuthor = await this.authorModel.findByPk(author.id.toValue());
    return AuthorMap.toDomain(savedAuthor);
  }

  public async remove(authorId: AuthorId | string): Promise<boolean> {
    const existingAuthor = await this.authorModel.findByPk(
      authorId instanceof AuthorId
        ? (<AuthorId>authorId).id.toValue()
        : authorId
    );

    if (!!existingAuthor) {
      await existingAuthor.destroy();
      return true;
    }

    return false;
  }
}
