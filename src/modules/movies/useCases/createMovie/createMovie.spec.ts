import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { BadRequest, InvalidId } from '../../../../core/logic/Errors';

import { MovieRepo } from '../../repos/movieRepo';
import { ActorRepo } from '../../repos/actorRepo';
import { AuthorRepo } from '../../repos/authorRepo';

import { CreateMovieUseCase } from './createMovieUseCase';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './createMovie.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const movieRepo = new MovieRepo(models);
  const actorRepo = new ActorRepo(models);
  const authorRepo = new AuthorRepo(models);
  const createMovieUseCase = new CreateMovieUseCase(
    movieRepo,
    actorRepo,
    authorRepo
  );

  let useCaseResult: any;

  let name: string;
  let year: number;
  let actors: string[];
  let authors: string[];

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

  afterAll(async () => {
    await models.Movie.destroy({
      where: {}
    });
  });

  test('Create movie with valid details (without actors/authors)', ({
    given,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      name = 'Iron Man';
      year = 2008;
    });

    when('attempt to create movie', async () => {
      useCaseResult = await createMovieUseCase.execute({
        data: {
          name,
          year
        }
      });
    });

    then('movie should be created successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.name).toBe(name);
      expect(resultValue.year).toBe(year);
      expect(resultValue.actors).toBeDefined();
      expect(resultValue.actors.length).toBe(0);
      expect(resultValue.authors).toBeDefined();
      expect(resultValue.authors.length).toBe(0);
    });
  });

  test('Create movie with valid details (with valid actors/authors)', ({
    given,
    and,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      name = 'Iron Man';
      year = 2008;
    });

    and('valid actor/author identity list', async () => {
      actors = actorList.map((actor: any) => actor.id);
      authors = authorList.map((author: any) => author.id);
    });

    when('attempt to create movie', async () => {
      useCaseResult = await createMovieUseCase.execute({
        data: {
          name,
          year,
          actors,
          authors
        }
      });
    });

    then('movie should be created successfully', async () => {
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

  test('Create movie with valid details (with invalid actors/authors identity)', ({
    given,
    and,
    when,
    then
  }) => {
    given('a valid movie details', () => {
      name = 'Iron Man';
      year = 2008;
    });

    and('invalid actor/author identity list', async () => {
      actors = [new UniqueID().toString()];
      authors = [new UniqueID().toString(), new UniqueID().toString()];
    });

    when('attempt to create movie', async () => {
      useCaseResult = await createMovieUseCase.execute({
        data: {
          name,
          year,
          actors,
          authors
        }
      });
    });

    then('movie should be created successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.name).toBe(name);
      expect(resultValue.year).toBe(year);
      expect(resultValue.actors).toBeDefined();
      expect(resultValue.actors.length).toBe(0);
      expect(resultValue.authors).toBeDefined();
      expect(resultValue.authors.length).toBe(0);
    });
  });

  test('Create movie with valid details (with invalid actors/authors identity format)', ({
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
      actors = ['invalid'];
      authors = ['invalid', 'invalid'];
    });

    when('attempt to create movie', async () => {
      useCaseResult = await createMovieUseCase.execute({
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

  test('Create movie with invalid details', ({ given, when, then }) => {
    given('an invalid movie details', () => {
      name = '';
      year = 1;
    });

    when('attempt to create movie', async () => {
      useCaseResult = await createMovieUseCase.execute({
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
