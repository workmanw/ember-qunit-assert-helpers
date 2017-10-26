import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupAssertTest from '../helpers/setup-assert-test';

// ............................................................
// Warning outside of a test. Should not cause test failures.
Ember.warn('Warning outside of a test', false, { id: 'warning-test', until: '3.0.0' });
// ............................................................

module('Run Loop Assert', function(hooks) {
  setupTest(hooks);
  setupAssertTest(hooks);

  test('expectWarning called after test and with warning', function(assert) {
    Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    assert.expectWarning();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called after test and without warning', function(assert) {
    assert.expectWarning();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectWarning called with callback and with warning', function(assert) {
    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called with callback and without warning', function(assert) {
    assert.expectWarning(() => { });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectWarning called with callback and after test', function(assert) {
    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.expectWarning();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, 'first `expectWarning` captured warning call');
    assert.notOk(this.pushedResults[1].result, 'second `expectWarning` logged failed result');
  });

  test('expectWarning called after test, with matcher and matched warning', function(assert) {
    Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    assert.expectWarning(/Something warned/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called after test, with matcher and unmatched warning', function(assert) {
    Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    assert.expectWarning(/different warning/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectWarning called with callback, matcher and matched warning', function(assert) {
    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /Something warned/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning call');
  });

  test('expectWarning called with callback, matcher and unmatched warning', function(assert) {
    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /different warning/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectWarning` logged failed result');
  });

  test('expectNoWarning called after test and without warning', function(assert) {
    assert.expectNoWarning();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectNoWarning` caught no warning');
  });

  test('expectNoWarning called after test and with warning', function(assert) {
    Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });

    assert.expectNoWarning();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectNoWarning` caught logged failed result');
  });

  test('expectNoWarning called with callback and with warning', function(assert) {
    assert.expectNoWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectNoWarning` caught logged failed result');
  });

  test('expectNoWarning called with callback and without warning', function(assert) {
    assert.expectNoWarning(() => { });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectNoWarning` caught no warning');
  });

  test('expectNoWarning called with callback and after test', function(assert) {
    assert.expectNoWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    });

    assert.expectNoWarning();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, 'first `expectNoWarning` caught logged failed result');
    assert.ok(this.pushedResults[1].result, 'second `expectNoWarning` caught no warning');
  });

  test('expectWarning with regex matcher', function(assert) {
    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, /Somethi[a-z ]*rned/);
    assert.expectWarning(() => {
      Ember.deprecate('/Something* warned/', false, { id: 'warning-test', until: '3.0.0' });
    }, /Something* warned/);


    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectWarning` matched RegExp');
    assert.notOk(this.pushedResults[1].result, '`expectWarning` didn\'t RegExp as String match');
  });

  test('expectWarning with string matcher', function(assert) {
    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, 'Something');

    assert.expectWarning(() => {
      Ember.warn('Something warned', false, { id: 'warning-test', until: '3.0.0' });
    }, 'Something.*');

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectWarning` captured warning for partial string match');
    assert.notOk(this.pushedResults[1].result, '`expectWarning` didn\'t test a string match as RegExp');
  });
});
