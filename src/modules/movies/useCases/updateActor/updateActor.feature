Feature: Update actor details

  Scenario: Update actor with valid details
    Given a valid actor details
    When attempt to update actor details
    Then actor should be updated successfully

  Scenario: Update actor with invalid identity format
    Given an invalid identity format
    When attempt to update actor details
    Then get invalid identity error

  Scenario: Update actor with invalid identity
    Given an invalid actor identity
    When attempt to update actor details
    Then get not found error

  Scenario: Update actor with invalid details
    Given an invalid actor details
    When attempt to update actor details
    Then get actor details error

