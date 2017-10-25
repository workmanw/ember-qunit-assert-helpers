import Ember from 'ember';
import { module, test } from 'qunit';
import { render } from 'ember-test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import setupAssertTest from '../helpers/setup-assert-test';

module('Assertion', function(hooks) {
  setupRenderingTest(hooks);
  setupAssertTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('component:x-assert-test', Ember.Component.extend({
      init() {
        this._super();
        Ember.assert('x-assert-test will always assert');
      }
    }));
  });

  test('Check for assert', function(assert) {
    assert.expectAssertion(() => {
      render(hbs`{{x-assert-test}}`);
    }, /x-assert-test will always assert/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, 'properly catured assertion');
  });

  test('Check for async assert', function(assert) {
    this.owner.register('component:x-assert-async-test', Ember.Component.extend({
      init() {
        this._super();
        let ms = 10;
        return new Ember.RSVP.Promise(() => {
          return Ember.run.later(this, '_assert', ms);
        });
      },
      _assert() {
        Ember.assert('x-assert-async-test will asynchronously assert');
      }
    }));

    assert.expectAssertion(async function() {
      await render(hbs`{{x-assert-test}}`);
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
        render(hbs`{{x-assert-test}}`);
      }, /x-assert-test will always assert/);

      // Restore the asserts (removes the mocking)
      this.restoreAsserts();

      assert.equal(errorCalled, false, 'assertion was not logged');
    } finally {
      Ember.Logger.error = origLoggerError;
    }
  });
});
