Feature: Update author details

  Scenario: Update author with valid details
    Given a valid author details
    When attempt to update author details
    Then author should be updated successfully

  Scenario: Update author with invalid identity format
    Given an invalid identity format
    When attempt to update author details
    Then get invalid identity error

  Scenario: Update author with invalid identity
    Given an invalid author identity
    When attempt to update author details
    Then get not found error

  Scenario: Update author with invalid details
    Given an invalid author details
    When attempt to update author details
    Then get author details error

