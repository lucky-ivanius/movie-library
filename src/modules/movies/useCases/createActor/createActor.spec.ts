import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { ActorRepo } from '../../repos/actorRepo';
import { CreateActorUseCase } from './createActorUseCase';
import { BadRequest } from '../../../../core/logic/Errors';

const feature = loadFeature(path.join(__dirname, './createActor.feature'));

defineFeature(feature, async (test) => {
  const { models } = sequelize;

  const actorRepo = new ActorRepo(models);
  const createActorUseCase = new CreateActorUseCase(actorRepo);

  let useCaseResult: any;

  let fullName: string;

  afterAll(async () => {
    await models.Actor.destroy({
      where: {}
    });
  });

  test('Create actor with valid details', ({ given, when, then }) => {
    given('a valid actor details', () => {
      fullName = 'Robert Downey, Jr.';
    });

    when('attempt to create actor', async () => {
      useCaseResult = await createActorUseCase.execute({
        data: {
          fullName
        }
      });
    });

    then('actor should be created successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.fullName).toBe(fullName);
    });
  });

  test('Create actor with invalid details', ({ given, when, then }) => {
    given('an invalid actor details', () => {
      fullName = 'XD';
    });

    when('attempt to create actor', async () => {
      useCaseResult = await createActorUseCase.execute({
        data: {
          fullName
        }
      });
    });

    then('get actor details error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(BadRequest);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });
});
