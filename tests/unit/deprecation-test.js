import Ember from 'ember';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupAssertTest from '../helpers/setup-assert-test';

// ............................................................
// Deprecation outside of a test. Should not cause test failures.
Ember.deprecate('Deprecation outside of a test', false, { id: 'deprecation-test', until: '3.0.0' });
// ............................................................

module('Deprecation Assert', function(hooks) {
  setupTest(hooks);
  setupAssertTest(hooks);

  test('expectDeprecation called after test and with deprecation', function(assert) {
    Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    assert.expectDeprecation();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called after test and without deprecation', function(assert) {
    assert.expectDeprecation();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectDeprecation called with callback and with deprecation', function(assert) {
    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called with callback and without deprecation', function(assert) {
    assert.expectDeprecation(() => { });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectDeprecation called with callback and after test', function(assert) {
    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    assert.expectDeprecation();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, 'first `expectDeprecation` captured deprecation call');
    assert.notOk(this.pushedResults[1].result, 'second `expectDeprecation` logged failed result');
  });

  test('expectDeprecation called after test, with matcher and matched deprecation', function(assert) {
    Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    assert.expectDeprecation(/Something deprecated/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called after test, with matcher and unmatched deprecation', function(assert) {
    Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    assert.expectDeprecation(/different deprecation/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectDeprecation called with callback, matcher and matched deprecation', function(assert) {
    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /Something deprecated/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectDeprecation` captured deprecation call');
  });

  test('expectDeprecation called with callback, matcher and unmatched deprecation', function(assert) {
    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /different deprecation/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectDeprecation` logged failed result');
  });

  test('expectNoDeprecation called after test and without deprecation', function(assert) {
    assert.expectNoDeprecation();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectNoDeprecation` caught no deprecation');
  });

  test('expectNoDeprecation called after test and with deprecation', function(assert) {
    Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });

    assert.expectNoDeprecation();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectNoDeprecation` caught logged failed result');
  });

  test('expectNoDeprecation called with callback and with deprecation', function(assert) {
    assert.expectNoDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, '`expectNoDeprecation` caught logged failed result');
  });

  test('expectNoDeprecation called with callback and without deprecation', function(assert) {
    assert.expectNoDeprecation(() => { });

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectNoDeprecation` caught no deprecation');
  });

  test('expectNoDeprecation called with callback and after test', function(assert) {
    assert.expectNoDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    });

    assert.expectNoDeprecation();

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.notOk(this.pushedResults[0].result, 'first `expectNoDeprecation` caught logged failed result');
    assert.ok(this.pushedResults[1].result, 'second `expectNoDeprecation` caught no deprecation');
  });

  test('expectDeprecation with regex matcher', function(assert) {
    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /Somethi[a-z ]*ecated/);
    assert.expectDeprecation(() => {
      Ember.deprecate('/Something* deprecated/', false, { id: 'deprecation-test', until: '3.0.0' });
    }, /Something* deprecated/);

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectDeprecation` matched RegExp');
    assert.notOk(this.pushedResults[1].result, '`expectDeprecation` didn\'t RegExp as String match');
  });

  test('expectDeprecation with string matcher', function(assert) {
    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, 'Something');

    assert.expectDeprecation(() => {
      Ember.deprecate('Something deprecated', false, { id: 'deprecation-test', until: '3.0.0' });
    }, 'Something.*');

    // Restore the asserts (removes the mocking)
    this.restoreAsserts();

    assert.ok(this.pushedResults[0].result, '`expectDeprecation` captured deprecation for partial String match');
    assert.notOk(this.pushedResults[1].result, '`expectDeprecation` didn\'t test a String match as RegExp');
  });
});
