import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { ActorRepo } from '../../repos/actorRepo';
import { FindActorsUseCase } from './findActorsUseCase';

const feature = loadFeature(path.join(__dirname, './findActors.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const actorRepo = new ActorRepo(models);
  const findActorsUseCase = new FindActorsUseCase(actorRepo);

  let useCaseResult: any;

  let fullName: string;
  let firstName: string;

  beforeAll(async () => {
    firstName = faker.name.firstName();

    await models.Actor.bulkCreate(
      [...Array(6).keys()].map(() => ({
        fullName: faker.name.fullName({
          firstName
        })
      }))
    );
    await models.Actor.bulkCreate(
      [...Array(4).keys()].map(() => ({
        fullName: faker.name.fullName()
      }))
    );
  });

  afterAll(async () => {
    await models.Actor.destroy({
      where: {}
    });
  });

  test('Find actors without any details', ({ given, when, then }) => {
    given('nothing', () => {
      fullName = '';
    });

    when('attempt to find actors', async () => {
      useCaseResult = await findActorsUseCase.execute({
        fullName
      });
    });

    then('get a list of all actor with the details', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(10);
      expect(resultValue[0].id).toBeDefined();
      expect(resultValue[0].fullName).toBeDefined();
    });
  });

  test('Find actors with valid details', ({ given, when, then }) => {
    given('a valid actor details', () => {
      fullName = firstName;
    });

    when('attempt to find actors', async () => {
      useCaseResult = await findActorsUseCase.execute({
        fullName
      });
    });

    then('get a list of actor with the details', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(6);
      expect(resultValue[0].id).toBeDefined();
      expect(resultValue[0].fullName).toBeDefined();
    });
  });

  test('Find actors with invalid details', ({ given, when, then }) => {
    given('a random/invalid actor details', () => {
      fullName = 'random';
    });

    when('attempt to find actors', async () => {
      useCaseResult = await findActorsUseCase.execute({ fullName });
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
