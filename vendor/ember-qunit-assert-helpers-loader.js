/* globals require */

// Loading the file here will install the asserts onto `QUnit.Assert` class.
// 'ember-qunit-assert-helpers/test-support/install-qunit-asserts' is not available at the current cycle
// delay the require onto the next tick until all lazy loaded require statements are resolved
Promise.resolve().then(() => {
  require('ember-qunit-assert-helpers/test-support/install-qunit-asserts');
});
