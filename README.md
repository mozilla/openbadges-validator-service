# openbadges-validator-service [![Build Status](https://travis-ci.org/mozilla/openbadges-validator-service.png)](https://travis-ci.org/mozilla/openbadges-validator-service)

This is the Web front-end for [openbadges-validator][].

## Quick Start

```bash
$ npm install
$ npm test
$ node bin/openbadges-validator-service.js
```

Then visit http://localhost:8888.

## Environment Variables

* `PORT` is the port to serve the Web application on. Defaults to 8888.

* `NEW_RELIC_HOME` is the optional path to the directory containing
  `newrelic.js`, if you want to integrate with
  [New Relic][].

## API

A simple CORS-enabled API is exposed by the validator. Requests should be made
with a `Accept: application/json` header to receive the data as JSON.

### `POST /`

Returns the `openbadges-validator` [info object][].

#### Request Parameters

* **assertion**: An assertion url, JSON metadata object, or signature

#### Response

Successful requests will include:

* `status`: `"valid"`
* `info`: The [info object][]

Errors will include:

* `status`: `"invalid"`
* `reason`: Brief description of cause
* `error`: Detailed error info

[info object]: https://github.com/mozilla/openbadges-validator#validatorthing-callback

## Acceptance Tests

Acceptance tests are automatically run with `npm test`. Their behavior
can be changed by the following environment variables:

* `ACCEPTANCE_DEBUG` represents a boolean value. If it exists, logging
  output will be displayed that makes the tests easier to debug.

* `ACCEPTANCE_BROWSER_NAME` is the name of the browser to use when
  running the acceptance tests. If this is `phantom` (the default), phantomjs
  is automatically started and used for browser automation. Otherwise, it's
  assumed that a [WebDriver][] server is hosted at port 4444 and the
  `browserName` capability is set to this environment variable.

* `ACCEPTANCE_EXTERNAL_URL` lets you provide an external URL to test instead
of running against an instance on `localhost`. This is useful to test
application deployments.

## Test Coverage

Build/install [jscoverage][], run `make test-cov`, then open
`coverage.html` in a browser.

## License

MPL 2.0

  [openbadges-validator]: https://github.com/mozilla/openbadges-validator
  [New Relic]: http://newrelic.com/
  [jscoverage]: https://github.com/visionmedia/node-jscoverage
