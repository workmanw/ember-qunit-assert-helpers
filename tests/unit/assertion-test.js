import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupAssertTest from '../helpers/setup-assert-test';

module('Assertion', function(hooks) {
  setupTest(hooks);
  setupAssertTest(hooks);

  test('expectAssertion called with assert', function(assert) {
    assert.expectAssertion(() => {
      Ember.assert('testing assert');
    });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectAssertion` captured deprecation call');
  });

  test('expectAssertion called without deprecation', function(assert) {
    assert.expectAssertion(() => {
      Ember.assert('testing assert', true);
    });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectAssertion` logged failed result');
  });

  test('expectAssertion called with deprecation and matched assert', function(assert) {
    assert.expectAssertion(() => {
      Ember.assert('testing assert');
    }, /testing/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectAssertion` captured deprecation call');
  });

  test('expectAssertion called with deprecation and unmatched assert', function(assert) {
    assert.expectAssertion(() => {
      Ember.assert('testing assert');
    }, /different/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectAssertion` logged failed result');
  });
});
