# ember-qunit-assert-helpers Changelog

### 0.2.0 (August 8th, 2017)

- [#16](https://github.com/workmanw/ember-qunit-assert-helpers/pull/16) Matcher will use `includes` behavior for Strings and `match` behavior` for RegExp. Prevents strings with regex operators from incorrectly evaluated. (@workmanw, @MichalBryxi)
- [#14](https://github.com/workmanw/ember-qunit-assert-helpers/pull/14) Prevent caught assertions from being logged. (@kturney)

### 0.1.3 (March 12th, 2017)

- [#8](https://github.com/workmanw/ember-qunit-assert-helpers/pull/8) Fixed bug that caused exception if a warning or deprecation occurred outside of the test scope. (@workmanw)
- [#6](https://github.com/workmanw/ember-qunit-assert-helpers/pull/6) Improved the implementation of `expectAssertion` to handle assertions thrown inside of a runloop. (@workmanw)

### 0.1.2 (February 8th, 2017)

- Added repository information to the `package.json` so it could be located my NPM and Ember Observer. (@workmanw)

### 0.1.1 (February 2nd, 2017)

- [#3](https://github.com/workmanw/ember-qunit-assert-helpers/pull/3) Fixed issue that occurred when fingerprint test files (@workmanw)

### 0.1.0 (February 1st, 2017)

- [#1](https://github.com/workmanw/ember-qunit-assert-helpers/pull/1) Initial implementation (@workmanw)
