import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { UniqueID } from '../../../../core/domain/UniqueID';
import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';

import { MovieRepo } from '../../repos/movieRepo';
import { UpdateMovieUseCase } from './updateMovieUseCase';
import { ActorRepo } from '../../repos/actorRepo';
import { AuthorRepo } from '../../repos/authorRepo';

const feature = loadFeature(path.join(__dirname, './updateMovie.feature'));

defineFeature(feature, async (test) => {
  const { models } = sequelize;

  const movieRepo = new MovieRepo(models);
  const actorRepo = new ActorRepo(models);
  const authorRepo = new AuthorRepo(models);
  const updateMovieUseCase = new UpdateMovieUseCase(
    movieRepo,
    actorRepo,
    authorRepo
  );

  let useCaseResult: any;

  let dummyMovie: any;

  let id: string;
  let name: string;
  let year: number;

  let actors: {
    new?: string[];
    removes?: string[];
  };
  let authors: {
    new?: string[];
    removes?: string[];
  };

  let actorList: any[];
  let authorList: any[];

  beforeAll(async () => {
    actorList = await models.Actor.bulkCreate(
      [...Array(4).keys()].map(() => ({
        fullName: faker.name.fullName()
      }))
    );
    authorList = await models.Author.bulkCreate(
      [...Array(4).keys()].map(() => ({
        fullName: faker.name.fullName()
      }))
    );
  });

  beforeEach(async () => {
    name = faker.random.words(2);
    year = 2000;
    dummyMovie = await models.Movie.create({
      name,
      year
    });
    dummyMovie.setActors(actorList.map((actor) => actor.id));
    dummyMovie.setAuthors(authorList.map((actor) => actor.id));
    dummyMovie = await models.Movie.findByPk(dummyMovie.id, {
      include: [
        {
          model: models.Actor
        },
        {
          model: models.Author
        }
      ]
    });
  });

  afterAll(async () => {
    await models.Movie.destroy({
      where: {}
    });
  });

  test('Update movie with valid details (without actors/authors)', ({
    given,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      id = dummyMovie.id;
      name = faker.random.words(2);
      year = 2022;
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year
        }
      });
    });

    then('movie should be updated successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.name).toBe(name);
      expect(resultValue.year).toBe(year);
      expect(resultValue.actors).toBeDefined();
      expect(resultValue.actors.length).toBe(4);
      expect(resultValue.authors).toBeDefined();
      expect(resultValue.authors.length).toBe(4);
    });
  });

  test('Update movie with valid details (with valid actors/authors)', ({
    given,
    and,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      id = dummyMovie.id;
      name = faker.random.words(2);
      year = 2022;
    });

    and('valid actor/author identity list', async () => {
      actorList = await models.Actor.bulkCreate(
        [...Array(4).keys()].map(() => ({
          fullName: faker.name.fullName()
        }))
      );
      actors = {
        new: actorList.map((actor) => actor.id)
      };
      authors = {
        removes: [authorList[0].id, authorList[1].id]
      };
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year,
          actors,
          authors
        }
      });
    });

    then('movie should be updated successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.name).toBe(name);
      expect(resultValue.year).toBe(year);
      expect(resultValue.actors).toBeDefined();
      expect(resultValue.actors.length).toBe(8);
      expect(resultValue.authors).toBeDefined();
      expect(resultValue.authors.length).toBe(2);
    });
  });

  test('Update movie with valid details (with invalid actors/authors identity)', ({
    given,
    and,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      id = dummyMovie.id;
      name = faker.random.words(2);
      year = 2022;
    });

    and('invalid actor/author identity list', async () => {
      actors = {
        new: [new UniqueID().toString()]
      };
      authors = {
        removes: [new UniqueID().toString(), new UniqueID().toString()]
      };
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year,
          actors,
          authors
        }
      });
    });

    then('movie should be updated successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();

      expect(resultValue.id).toBeDefined();
      expect(resultValue.name).toBe(name);
      expect(resultValue.year).toBe(year);
      expect(resultValue.actors).toBeDefined();
      expect(resultValue.actors.length).toBe(4);
      expect(resultValue.authors).toBeDefined();
      expect(resultValue.authors.length).toBe(4);
    });
  });

  test('Update movie with valid details (with invalid actors/authors identity format)', ({
    given,
    and,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      name = 'Iron Man';
      year = 2008;
    });

    and('invalid actor/author identity format list', async () => {
      actors = {
        new: ['invalid']
      };
      authors = {
        removes: ['invalid', 'invalid']
      };
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year,
          actors,
          authors
        }
      });
    });

    then('get invalid identity error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(InvalidId);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });

  test('Update movie with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
      name = faker.random.words(2);
      year = 2022;
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year
        }
      });
    });

    then('get invalid identity error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(InvalidId);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });

  test('Update movie with invalid identity', ({ given, when, then }) => {
    given('an invalid movie identity', () => {
      id = new UniqueID().toString();
      name = faker.random.words(2);
      year = 2022;
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year
        }
      });
    });

    then('get not found error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(NotFound);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });

  test('Update movie with invalid details', ({ given, when, then }) => {
    given('an invalid movie details', () => {
      id = dummyMovie.id;
      name = faker.random.words(2);
      year = 1000;
    });

    when('attempt to update movie', async () => {
      useCaseResult = await updateMovieUseCase.execute({
        id,
        data: {
          name,
          year
        }
      });
    });

    then('get movie details error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(BadRequest);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });
});
