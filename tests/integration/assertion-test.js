import Ember from 'ember';
import { test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moduleForAssert from '../helpers/module-for-assert';

let assertMessage = 'x-assert-test will always [assert]';

moduleForAssert('Integration: Assertion', {
  integration: true,
  beforeEach() {
    this.register('component:x-assert-test', Ember.Component.extend({
      init() {
        this._super();
        Ember.assert(assertMessage);
      }
    }));
  }
});

test('Check for assert', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{x-assert-test}}`);
  }, /x-assert-test will always/);

  // Restore the asserts (removes the mocking)
  this.restoreAsserts();

  assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning call');
});

test('False match', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{x-assert-test}}`);
  }, assertMessage);

  // Restore the asserts (removes the mocking)
  this.restoreAsserts();

  let expected = `Assertion Failed: ${assertMessage}`;
  assert.notOk(this.pushedResults[0].result, '`expectWarning` captured that the matcher does not match assertion string');
  assert.notEqual(expected, this.pushedResults[0].actual, '`expectAssertion` actual value and expected should not be identical');
});
