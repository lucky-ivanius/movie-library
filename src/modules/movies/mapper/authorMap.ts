import { UniqueID } from '../../../core/domain/UniqueID';
import { Mapper } from '../../../core/infrastructure/Mapper';

import { Author } from '../domain/author';

export class AuthorMap extends Mapper<Author> {
  private static toProps(author: Author) {
    const props = {
      fullName: author.fullName.trim()
    };

    return props;
  }

  public static toPersistence(author: Author): any {
    const id = author.id.toString();
    const props = this.toProps(author);

    return { id, ...props };
  }

  public static toDomain(raw: any): Author {
    const authorOrError = Author.create(
      {
        fullName: raw.fullName,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueID(raw.id)
    );
    if (authorOrError.isFailure) console.log(authorOrError.error);

    return authorOrError.getValue() || null;
  }
}
