# openbadges-validator-service tests

## Latest Travis Build

[![Build Status](https://travis-ci.org/mozilla/openbadges-validator-service.png)](https://travis-ci.org/mozilla/openbadges-validator-service)

## Manual Smoke Testing

Wherever the validator service has been deployed, 

1. copy the contents of `/oldassertion.valid.json` and paste into the validator
2. check that the validator reports **Valid** and **Spec Version: 0.5.0**
3. copy the contents of `/assertion.valid.json` and paste into the validator
4. check that the validator reports **Valid** and **Spec Version: 1.0.0**
5. copy the contents of `/signature.valid` and paste into the validator
6. check that the validator reports **Valid** and **Spec Version: 1.0.0**
7. paste `{ "foo": "bar" }` into the validator
8. check that the validator reports **Invalid** with a reason
9. paste `foo` into the validator
10. check that the validator reports **Invalid** and **Reason: not a valid signed badge**