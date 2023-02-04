Feature: Delete author

  Scenario: Delete author with valid identity
    Given a valid author identity
    When attempt to delete author
    Then author should be deleted successfully

  Scenario: Delete author with invalid identity format
    Given an invalid identity format
    When attempt to delete author
    Then get invalid identity error

  Scenario: Delete author with invalid identity
    Given an invalid author identity
    When attempt to delete author
    Then get not found error
