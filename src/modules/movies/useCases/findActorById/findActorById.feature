Feature: Find actor by id

  Scenario: Find actor with valid identity
    Given a valid actor identity
    When attempt to find actor
    Then details of actor should be defined

  Scenario: Find actor with invalid identity format
    Given an invalid identity format
    When attempt to find actor
    Then get invalid identity error

  Scenario: Find actor with invalid identity
    Given an invalid actor identity
    When attempt to find actor
    Then get not found error
