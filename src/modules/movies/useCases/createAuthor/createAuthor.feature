Feature: Create author

  Scenario: Create author with valid details
    Given a valid author details
    When attempt to create author
    Then author should be created successfully

  Scenario: Create author with invalid details
    Given an invalid author details
    When attempt to create author
    Then get author details error
