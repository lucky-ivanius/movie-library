Feature: Find author by id

  Scenario: Find author with valid identity
    Given a valid author identity
    When attempt to find author
    Then details of author should be defined

  Scenario: Find author with invalid identity format
    Given an invalid identity format
    When attempt to find author
    Then get invalid identity error

  Scenario: Find author with invalid identity
    Given an invalid author identity
    When attempt to find author
    Then get not found error
