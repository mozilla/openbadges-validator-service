Feature: Validates assertions
  In order to be able to comply with the OBI specifications
  As a badge issuer,
  I want to validate my assertions

  Scenario: Correct 0.5.0 assertion
    When I paste in a properly formatted 0.5.0 assertion
    Then I expect the validator to report that it's valid
    And show me that it's version 0.5.0

  Scenario: Correct 1.0.0 assertion
    When I paste in a properly formatted 1.0.0 assertion
    Then I expect the validator to report that it's valid
    And show me that it's version 1.0.0

  Scenario: Correct 1.0.0 signature
    When I paste in a properly formatted 1.0.0 signature
    Then I expect the validator to report that it's valid
    And show me that it's version 1.0.0