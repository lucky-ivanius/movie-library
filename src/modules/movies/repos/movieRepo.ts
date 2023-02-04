import { Op } from 'sequelize';
import { ActorCollection } from '../domain/actor';
import { AuthorCollection } from '../domain/author';

import { Movie, MovieCollection } from '../domain/movie';
import { MovieId } from '../domain/movieId';
import { MovieMap } from '../mapper/movieMap';

export interface IMovieRepo {
  findMovieById(movieId: MovieId | string): Promise<Movie | null>;
  findMovies(query?: any): Promise<MovieCollection>;
  exists(movieId: MovieId | string): Promise<boolean>;
  save(movie: Movie): Promise<Movie>;
  remove(movieId: MovieId | string): Promise<boolean>;
}

export class MovieRepo implements IMovieRepo {
  protected movieModel: any;
  protected actorModel: any;
  protected authorModel: any;

  constructor(private models: any) {
    this.movieModel = this.models.Movie;
    this.actorModel = this.models.Actor;
    this.authorModel = this.models.Author;
  }

  public async findMovieById(movieId: MovieId | string): Promise<Movie | null> {
    const movie = await this.movieModel.findByPk(
      movieId instanceof MovieId ? (<MovieId>movieId).id.toValue() : movieId,
      {
        include: [
          {
            model: this.actorModel
          },
          {
            model: this.authorModel
          }
        ]
      }
    );
    if (!!movie) return MovieMap.toDomain(movie);
    return null;
  }

  public async findMovies(query?: any): Promise<MovieCollection> {
    const where: any = {
      name: { [Op.iLike]: `%${query.name || ''}%` }
    };

    if ('year' in query) {
      where['year'] = query.year;
    }

    const movies = await this.movieModel.findAll({
      where,
      include: [
        {
          model: this.actorModel
        },
        {
          model: this.authorModel
        }
      ]
    });

    return movies.map((movie: any) => MovieMap.toDomain(movie));
  }

  public async exists(movieId: MovieId | string): Promise<boolean> {
    const movie = await this.movieModel.findByPk(
      movieId instanceof MovieId ? (<MovieId>movieId).id.toValue() : movieId
    );
    return !!movie;
  }

  private async setMovieActors(
    models: any,
    actors: ActorCollection
  ): Promise<any> {
    if (!!models === false || actors.length === 0) return;
    return models.setActors(actors.map((actor) => actor.actorId.id.toString()));
  }

  private async removeMovieActors(
    models: any,
    actors: ActorCollection
  ): Promise<any> {
    if (!!models === false || actors.length === 0) return;
    return models.removeActors(
      actors.map((actor) => actor.actorId.id.toString())
    );
  }

  private async setMovieAuthors(
    models: any,
    authors: AuthorCollection
  ): Promise<any> {
    if (!!models === false || authors.length === 0) return;
    return models.setAuthors(
      authors.map((author) => author.authorId.id.toString())
    );
  }

  private async removeMovieAuthors(
    models: any,
    authors: AuthorCollection
  ): Promise<any> {
    if (!!models === false || authors.length === 0) return;
    return models.removeAuthors(
      authors.map((author) => author.authorId.id.toString())
    );
  }

  public async save(movie: Movie): Promise<Movie> {
    const existingMovie = await this.movieModel.findByPk(movie.id.toValue());
    const rawMovie = MovieMap.toPersistence(movie);

    let movieModel;

    if (!!existingMovie) {
      movieModel = await existingMovie.update(rawMovie);
    } else {
      movieModel = await this.movieModel.create(rawMovie);
    }

    await this.setMovieActors(movieModel, movie.actors);
    await this.setMovieAuthors(movieModel, movie.authors);

    const savedMovie = await this.movieModel.findByPk(movie.id.toValue(), {
      include: [
        {
          model: this.actorModel
        },
        {
          model: this.authorModel
        }
      ]
    });
    return MovieMap.toDomain(savedMovie);
  }

  public async remove(movieId: MovieId | string): Promise<boolean> {
    const existingMovie = await this.movieModel.findByPk(
      movieId instanceof MovieId ? (<MovieId>movieId).id.toValue() : movieId
    );

    if (!!existingMovie) {
      await existingMovie.destroy();
      return true;
    }

    return false;
  }
}
