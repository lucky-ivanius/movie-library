import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { MovieRepo } from '../../repos/movieRepo';

import { FindMoviesUseCase } from './findMoviesUseCase';

const feature = loadFeature(path.join(__dirname, './findMovies.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const movieRepo = new MovieRepo(models);
  const findMoviesUseCase = new FindMoviesUseCase(movieRepo);

  let useCaseResult: any;

  let name: string;
  let year: number;

  let findName: string;
  let findYear: number;

  beforeAll(async () => {
    findName = 'Iron Man';
    findYear = 2000;
    await models.Movie.bulkCreate(
      [...Array(6).keys()].map(() => ({
        name: `${findName} ${faker.random.numeric()}`,
        year: findYear
      }))
    );
    await models.Movie.bulkCreate(
      [...Array(4).keys()].map(() => ({
        name: faker.random.words(2),
        year: 2022
      }))
    );
  });

  afterAll(async () => {
    await models.Movie.destroy({
      where: {}
    });
  });

  test('Find movies without any details', ({ given, when, then }) => {
    given('nothing', () => {
      name = '';
    });

    when('attempt to find movies', async () => {
      useCaseResult = await findMoviesUseCase.execute({});
    });

    then('get a list of all movie with the details', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(10);
      expect(resultValue[0].id).toBeDefined();
      expect(resultValue[0].name).toBeDefined();
      expect(resultValue[0].year).toBeDefined();
      expect(resultValue[0].actors).toBeDefined();
      expect(resultValue[0].authors).toBeDefined();
    });
  });

  test('Find movies with valid details', ({ given, when, then }) => {
    given('a valid movie details', () => {
      name = findName;
      year = findYear;
    });

    when('attempt to find movies', async () => {
      useCaseResult = await findMoviesUseCase.execute({
        name,
        year
      });
    });

    then('get a list of movie with the details', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(6);
      expect(resultValue[0].id).toBeDefined();
      expect(resultValue[0].name).toBeDefined();
      expect(resultValue[0].actors).toBeDefined();
      expect(resultValue[0].authors).toBeDefined();
    });
  });

  test('Find movies with invalid details', ({ given, when, then }) => {
    given('a random/invalid movie details', () => {
      name = 'random';
    });

    when('attempt to find movies', async () => {
      useCaseResult = await findMoviesUseCase.execute({ name });
    });

    then('get an empty list', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(0);
    });
  });
});
