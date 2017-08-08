import Ember from 'ember';
import { test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moduleForAssert from '../helpers/module-for-assert';


moduleForAssert('Integration: Assertion', {
  integration: true,
  beforeEach() {
    this.register('component:x-assert-test', Ember.Component.extend({
      init() {
        this._super();
        Ember.assert('x-assert-test will always assert');
      }
    }));
  }
});

test('Check for assert', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{x-assert-test}}`);
  }, /x-assert-test will always assert/);

  // Restore the asserts (removes the mocking)
  this.restoreAsserts();

  assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning call');
});

test('Does not log caught assertions', function(assert) {
  let origLoggerError = Ember.Logger.error;
  try {
    let errorCalled = false;
    Ember.Logger.error = () => {
      errorCalled = true;
    };

    assert.expectAssertion(() => {
      this.render(hbs`{{x-assert-test}}`);
    }, /x-assert-test will always assert/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.equal(errorCalled, false, 'assertion was not logged');
  } finally {
    Ember.Logger.error = origLoggerError;
  }
});
