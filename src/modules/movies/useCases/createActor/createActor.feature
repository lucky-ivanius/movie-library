Feature: Create actor

  Scenario: Create actor with valid details
    Given a valid actor details
    When attempt to create actor
    Then actor should be created successfully

  Scenario: Create actor with invalid details
    Given an invalid actor details
    When attempt to create actor
    Then get actor details error
