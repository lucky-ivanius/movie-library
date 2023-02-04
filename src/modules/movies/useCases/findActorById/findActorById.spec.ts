import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { ActorRepo } from '../../repos/actorRepo';
import { FindActorByIdUseCase } from './findActorByIdUseCase';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './findActorById.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const actorRepo = new ActorRepo(models);
  const findActorByIdUseCase = new FindActorByIdUseCase(actorRepo);

  let useCaseResult: any;

  let dummyActor: any;

  let id: string;
  let fullName: string;

  beforeEach(async () => {
    fullName = faker.name.fullName();
    dummyActor = await models.Actor.create({
      fullName
    });
  });

  afterAll(async () => {
    await models.Actor.destroy({
      where: {}
    });
  });

  test('Find actor with valid identity', ({ given, when, then }) => {
    given('a valid actor identity', () => {
      id = dummyActor.id;
    });

    when('attempt to find actor', async () => {
      useCaseResult = await findActorByIdUseCase.execute({
        id
      });
    });

    then('details of actor should be defined', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id.value).toBe(id);
      expect(resultValue.fullName).toBe(fullName);
    });
  });

  test('Find actor with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
    });

    when('attempt to find actor', async () => {
      useCaseResult = await findActorByIdUseCase.execute({
        id
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

  test('Find actor with invalid identity', ({ given, when, then }) => {
    given('an invalid actor identity', () => {
      id = new UniqueID().toString();
    });

    when('attempt to find actor', async () => {
      useCaseResult = await findActorByIdUseCase.execute({
        id
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
});
